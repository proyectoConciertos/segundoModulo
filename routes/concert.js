const express = require("express");
const router = express.Router();
const Concert = require("../models/Concert");
const upload = require('../helpers/multer');
const setlistfm = require("setlistfm-js");

var setlistfmClient = new setlistfm({
    key: "8e99d15f-0708-42ec-a955-845cfe715130", //Colocar la Personal Key de la API
    format: "json", //Elegir json o xml
    language: "en" //Default en Inglés
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/landing");
}

router.get("/", isLoggedIn, (req, res) => {
    var currentUser = req.user;
    Concert.find()
    .sort({ date: -1 })
        .then(concerts => {
            res.render("concerts", {concerts, currentUser});
        })
});

/* GET concert form */ 
router.get("/new-concert", isLoggedIn, (req, res, next) => {
    var currentUser = req.user;
    res.render("form", {currentUser});
});


/* POST concert form */ 
router.post("/form", isLoggedIn, upload.array('photos'), (req, res, next) => {
    let setlistSongs = [];
    let setlist = [];
    let concert = {};
    let photos = req.files.map(file => {
        return file.url
    });

    console.log(req.user);
    req.body.owner = req.user._id;

    const {owner, name, date, bands, venueName, lat, lng, review, rate} = req.body;
    let coordinates = [];
    coordinates.push(lng);
    coordinates.push(lat);

    function formatDate(date) {
        var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + (d.getDate() + 1),
        year = d.getFullYear();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        return [day, month, year].join("-");
    }

    if (req.body.bands.length > 1) {
        req.body.bands = req.body.bands.split(",");
    }

    if ("setlist" in req.body) {
        let dateSetlist = req.body.date;
        dateSetlist = formatDate(dateSetlist);
        let band = req.body.bands[0];

        //SEARCH SETLIST HERE
        setlistfmClient.searchSetlists({
            artistName: band,
            p: 1
        })
        .then(function(results) {
        let setlists = results.setlist;
            for (let i = 0; i < setlists.length; i++) {
                if (setlists[i].eventDate === dateSetlist) {
                    for (let j = 0; j < setlists[i].sets.set.length; j++) {
                        for (let k = 0; k < setlists[i].sets.set[j].song.length; k++) {
                            setlistSongs.push(setlists[i].sets.set[j].song[k].name);    
                        }
                    }
                }
            }
            console.log("tengo un setList",setlistSongs);
            req.body.setlist = setlistSongs;
            
            setlist = setlistSongs;
            concert = {
                owner,
                name,
                date,
                bands,
                venueName,
                venue:{
                    coordinates
                },
                review,
                rate,
                photos,
                setlist
            };
            console.log("concert",req.body)
            Concert.create(concert)
            .then(() => {
                res.redirect("/concert");
            })
            .catch(err => {
                console.log('NO se pudo crear concierto en DB' + err);
            })
            console.log(req.body);           
        })
        .catch(function(error) {
            console.log(error);
        });
    } else{
         concert = {
            owner,
            name,
            date,
            bands,
            venueName,
            venue:{
                coordinates
            },
            rate,
            photos,
            setlist
        };
        console.log("concert",req.body)
        Concert.create(concert)
        .then(() => {
            res.redirect("/concert");
        })
        .catch(err => {
            console.log('NO se pudo crear concierto en DB' + err);
        })
    }
});

router.get('/:id', isLoggedIn, (req, res) => {
    var currentUser = req.user;
    //console.log(req.params);
    Concert.findById(req.params.id)
    .populate('owner', 'username')
    .then(concert => {
        res.render('concertDetails', {header: concert.name, concert, currentUser})
    }) 
});

router.get('/feed', isLoggedIn, (req, res) => {
    Concert.find()
    .sort({ date: -1 })
        .then(concerts => {
            console.log(concerts);
        })
})

module.exports = router;