
const express = require("express");
const router = express.Router();
const Concert = require("../models/Concert");
const User = require("../models/User");


router.get("/main", (req, res) => {
    res.render("main");
  });
  
  router.post("/main", (req, res) => {});

//ricardo rama

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

            res.render('profile', {users, concerts});
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
//aqui termina
module.exports = router;
