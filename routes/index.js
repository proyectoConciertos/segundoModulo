
const express = require('express');
const router  = express.Router();
const passport = require('passport');
const User = require('../models/User');
const mail = require('../helpers/mailer');

const setlistfm = require("setlistfm-js");
const Concert = require("../models/Concert");
const upload = require('../helpers/multer');



var setlistfmClient = new setlistfm({
    key: "8e99d15f-0708-42ec-a955-845cfe715130", // Insert your personal key here
    format: "json", // "json" or "xml", defaults to "json"
    language: "en" // defaults to "en"
});


/* GET home page */
router.get("/", (req, res, next) => {
    res.render("index");
});

router.post('/', passport.authenticate ('local', {
  successRedirect: '/',
  failureRedirect: '/register'
}));

router.get('/register', (req,res) => {
  res.render('register')
})

router.post('/register', (req,res) => {
  const {username, email, password}  = req.body   //deconsruccion
    User.register ({username, email}, password) //user.register es un metodo que nos da passport local mongoose para registrar
      .then((user) => { //recibo el usuario
        const options = {
          email: user.email,
          subject: "Correo de prueba",
          message: ""
        };
        mail.send(options); //recibo la funcion send de mailer y le doy options como parametro
        res.redirect('/')
      }).catch(err => {
        res.status(500).render("register", {err, msg:"No pudimos registrarte"}) //el err lo recibes de passport local mongoose
      })
})

router.get('/main', (req,res) => {
  res.render('main')
})

router.post('/main', (req,res) => {
  res.render('main')
})
router.post("/form", upload.array('photos'), (req, res, next) => {
  let setlistSongs = [];
  let setlist = [];
  let concert = {};
  console.log(req.files);
  let photos = req.files.map(file => {
      return file.url
  });

  const {name, date, bands, venueName, lat, lng, rate} = req.body;
  let coordinates = [];
  coordinates.push(lng);
  coordinates.push(lat);
  
  
  //console.log(req.body)
  

//console.log(req.body.bands);
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
      let date = formatDate(req.body.date);
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
              if (setlists[i].eventDate === date) {
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
              res.redirect("/cards");
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
          res.redirect("/cards");
      })
      .catch(err => {
          console.log('NO se pudo crear concierto en DB' + err);
      })
  }


});

router.get("/form", (req, res, next) => {
res.render("form");
});


router.get('/cards', (req, res, next) => {
  Concert.find()
      .then(concerts => {
          res.render("cards", {concerts});
      })
})

module.exports = router;
