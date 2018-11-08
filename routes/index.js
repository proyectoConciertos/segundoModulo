const express = require("express");
const router = express.Router();
const Concert = require("../models/Concert");
const User = require("../models/User");


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
        });
}

/* GET home page */
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
    User.findById(req.body._id)
    .then(user => {
        console.log(user);
    })
    // console.log(req.user.followers);
    // req.user.following.push(req.body._id);
    // req.user.save();
    console.log(req.body);
    res.redirect('back');
})

module.exports = router;
