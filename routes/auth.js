const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const mail = require('../helpers/mailer');

//Rutas Index
router.get('/', (req,res) => {
  res.render('index')
})

router.post('/', passport.authenticate('local', {
  //successRedirect: '/',
  //failureRedirect: '/'
}));

//Ruta preloader
router.get('/preloadPage', (req,res) => {
  res.render('preloadPage')
})

console.log();

//Rutas MainPage
router.get('/main', (req,res) => {
  res.render('main')
})

router.post('/main', (req,res) => {

})

router.get('/prueba', (req,res) => {
  res.render('prueba')
})

module.exports = router;