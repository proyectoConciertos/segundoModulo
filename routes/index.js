
const express = require("express");
const router = express.Router();
const Concert = require("../models/Concert");
const User = require("../models/User");


router.get("/landing", (req, res) => {
    res.render("landing");
  });
  
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/landing");
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
        Concert.find()
        .then(concerts => {
         res.render('profile', {users, concerts});
        })
    });
});

router.get('/users/:username', (req, res) => {
    var followedBool = false;
    var myObj = {
        myString: 'Hi'
    }
    var followed = {
        a: 'a',
        b: 'b'
    }
    User.find({ username: req.params.username})
    .then(user => {
        Concert.find({owner: user[0]._id})
        .then(concerts => {
            if(req.user.username === user[0].username) {
                res.render('userProfile', {concerts,user, myObj});
            }
            else {
                console.log(user[0]);
                console.log(req.user);
                for(let i = 0; i < user[0].followers.length; i++) {
                    console.log(i);
                    if(user[0].followers[i].equals(req.user._id)) {
                        followedBool = true;
                    }
                }
                if(followedBool) {
                    res.render('userProfile', {concerts, user, followed});
                }
                else {
                    res.render('userProfile', {concerts, user});
                }
            }
        }) 
    }) 
});

router.post('/users/:username', (req, res) => {
    let loSigo = false;
    User.findById(req.body._id)
    .then(user => {
        let followedBool = false;
        for(let i = 0; i < user.followers.length; i++) {
            console.log(i);
            if(user.followers[i].equals(req.user._id)) {
                followedBool = true;
            }
        }
        if(followedBool === true) {
            loSigo = true;
            console.log('Ya sigues a ese men');
            console.log(`A ${user.username} (${user._id}) lo siguen ${user.followers}`);
            console.log(`A ${req.user.username} (${req.user._id}) sigue a ${req.user.following}`);
            user.followers.splice(req.body._id, 1);
            user.save();
            req.user.following.splice(user._id, 1);
            req.user.save();   
            res.redirect(req.get('referer', {loSigo}));
        } else {
            console.log('Aun no sigues a ese men');
            console.log(`A ${user.username} (${user._id}) lo siguen ${user.followers}`);
            console.log(`A ${req.user.username} (${req.user._id}) sigue a ${req.user.following}`);
            user.followers.push(req.user._id);
            user.save();
            req.user.following.push(user._id);
            req.user.save();
            res.redirect(req.get('referer', {loSigo}));
        }
    });
    
})

module.exports = router;
