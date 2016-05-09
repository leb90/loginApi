var UserModel = require('../models/users');
var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var passport = require('passport');
var client = require('./client');
var login = require('./login');




router.get("/list", function(req, res) {
    res.render("index.html", {
        title: "Formulario para logear un usuario"
    });
});

router.get("/create", function(req, res) {
    res.render("create.html", {
        title: "Formulario para crear un nuevo recurso"
    });
});
router.get("/edit", function(req, res) {
    res.render("edit.html", {
        title: "Formulario para crear un nuevo recurso"
    });
});

router.get("/delete", function(req, res) {
    res.render("delete.html", {
        title: "Formulario para eliminar un recurso"
    });
});

router.use('/client', client);
router.use('/login', login);





module.exports = router