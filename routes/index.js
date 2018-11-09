
const express = require("express");
const router = express.Router();
const Concert = require("../models/Concert");
const User = require("../models/User");


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
              res.redirect("/concerts");
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
          res.redirect("/concerts");
      })
      .catch(err => {
          console.log('NO se pudo crear concierto en DB' + err);
      })
  }


});

router.get("/form", (req, res, next) => {
res.render("form");
});

router.get('/concerts', (req, res, next) => {
  Concert.find()
      .then(concerts => {
          res.render("concerts", {concerts});
      })

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/auth/login");
}

function checkIfOwner(req, res, next){
    Concert.findById(req.params.id)
        .then(bid => {
            if(bid.owner.toString() === req.user._id.toString()){
                req.bid = bid;
                return next();
            }
            res.redirect('/bid');
        })
        .catch(() => {
            res.redirect("/bid");
            console.log('ajdhajdhajd');
        });
}

/* GET home page */
// aksjfhaskjfhajksfh
router.get("/", isLoggedIn, (req, res, next) => {
    User.find()
    .then(users => {
        //console.log(users);
        Concert.find()
        .then(concerts => {

            res.render('profile', {users});
        })
    });
});

router.get('/users/:username', (req, res) => {
    User.find({ username: req.params.username})
    .then(user => {
        Concert.find({owner: user[0]._id})
        .then(concerts => {
            if(req.user.username === user[0].username) {
                res.render('profile', {concerts,user});
            }
            else {
                res.render('userProfile', {concerts, user});
            }
            //console.log(concerts)
        }) 
    }) 
});

// FOLLOW A USER -> UPDATE USER FOLLOWING AND FOLLOWER LIST
// HOW TO FOLLOW/UNFOLLOW?
router.post('/users/:username', (req, res) => {
    //let followButton = document.getElementById('followButton');
    //console.log(followButton);
    User.findById(req.body._id)
    .then(user => {
        // Check if you follow that user
        if(user.followers.includes(req.user._id)) {
            console.log('Ya sigues a ese men');
            console.log(`A ${user.username} (${user._id}) lo siguen ${user.followers}`);
            console.log(`A ${req.user.username} (${req.user._id}) sigue a ${req.user.following}`);
            // user.followers.splice(req.body._id, 1);
            // user.save();
            // req.user.following.splice(user._id, 1);
            // req.user.save();
            console.log(req.body);
            res.status(204).send();
        } else {
            console.log('Aun no sigues a ese men');
            console.log(`A ${user.username} (${user._id}) lo siguen ${user.followers}`);
            console.log(`A ${req.user.username} (${req.user._id}) sigue a ${req.user.following}`);
            // user.followers.push(req.user._id);
            // user.save();
            // req.user.following.push(user._id);
            // req.user.save();
            console.log(req.body);
            res.status(204).send();
        }
        // console.log(user);
        // user.followers.push(req.body._id);
        // user.save();
        // req.user.following.push(user._id);
        // req.user.save();
    })
    // console.log(req.user.followers);
    // req.user.following
    // req.user.save();
    
})

module.exports = router;
