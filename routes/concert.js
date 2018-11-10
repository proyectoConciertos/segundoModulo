const express = require("express");
const router = express.Router();
const Concert = require("../models/Concert");
const upload = require('../helpers/multer');
const setlistfm = require("setlistfm-js");

var setlistfmClient = new setlistfm({
    key: "8e99d15f-0708-42ec-a955-845cfe715130", // Insert your personal key here
    format: "json", // "json" or "xml", defaults to "json"
    language: "en" // defaults to "en"
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/landing");
}

router.get("/", isLoggedIn, (req, res) => {
    Concert.find()
    .sort({ date: -1 })
        .then(concerts => {
            res.render("concerts", {concerts});
        })
});

/* GET concert form */ 
router.get("/new-concert", isLoggedIn, (req, res, next) => {
    res.render("form");
});


/* POST concert form */ 
router.post("/form", isLoggedIn, upload.array('photos'), (req, res, next) => {
    let setlistSongs = [];
    let setlist = [];
    let concert = {};
    //console.log(req.files);
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

    //var keys = Object.keys(req.body.concertBands)
    if (req.body.bands.length > 1) {
        req.body.bands = req.body.bands.split(",");
    }

    //console.log(req.body);
    if ("setlist" in req.body) {
        let dateSetlist = req.body.date;
        dateSetlist = formatDate(dateSetlist);
        //console.log(date);
        let band = req.body.bands[0];
        //console.log(band);

        //Por que Rediriges al form??? POR QUE?
        //res.redirect("/form");

        //SEARCH SETLIST HERE
        setlistfmClient.searchSetlists({
            artistName: band,
            p: 1
        })
        .then(function(results) {
            //console.log(results);

            let setlists = results.setlist;
            //console.log(setlists);
            for (let i = 0; i < setlists.length; i++) {
                if (setlists[i].eventDate === dateSetlist) {
                    for (let j = 0; j < setlists[i].sets.set.length; j++) {
                        //console.log(setlists[i].sets.set[j].song);
                        for (let k = 0; k < setlists[i].sets.set[j].song.length; k++) {
                            setlistSongs.push(setlists[i].sets.set[j].song[k].name);    
                        }
                        //res.redirect("/form");
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
                // if(res.status(200)) {
                //     console.log("si pude")
                // }
               // res.render('concerts')
                res.redirect("/concert");
            })
            .catch(err => {
                console.log('NO se pudo crear concierto en DB' + err);
            })
            console.log(req.body);           
        })
        .catch(function(error) {
            // Returns error
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
            // if(res.status(200)) {
            //     console.log("si pude")
            // }
           // res.render('concerts')
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
            //res.render("feed", {concerts});
            console.log(concerts);
        })
})

module.exports = router;