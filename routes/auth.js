const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const mail = require("../helpers/mailer");



router.get("/login", (req, res) => {
    res.render("login");
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }));

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { username, email, password } = req.body; //deconstruccion

User.register({ username, email }, password) //user.register es un metodo que nos da passport local mongoose para registrar
    .then(user => {
    //recibo el usuario
        const options = {
            email: user.email,
            subject: "Correo de prueba",
            message: ""
        };
        mail.send(options); //recibo la funcion send de mailer y le doy options como parametro
        res.redirect("/auth/login");
    })
    .catch(err => {
        res
            .status(500)
            .render("register", { err, msg: "No pudimos registrarte" }); //el err lo recibes de passport local mongoose
        console.log("NO jala el register", err);
    });
});

module.exports = router;
