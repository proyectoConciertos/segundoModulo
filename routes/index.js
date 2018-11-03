const express = require('express');
const router  = express.Router();
const passport = require('passport');
const User = require('../models/User');
const mail = require('../helpers/mailer');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
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

module.exports = router;
