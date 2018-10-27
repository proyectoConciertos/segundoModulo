const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req,res) => {
  res.render('index')
})

router.post('/', (req,res) => {

})


router.get('/main', (req,res) => {
  res.render('main')
})

router.post('/main', (req,res) => {

})

router.get('/register', (req,res) => {
  res.render('register')
})

module.exports = router;