var UserModel = require('../models/users');
var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var passport = require('passport');	
var client = require('./client');
var login = require('./login');

router.get("/update/:id", function(req, res) {
    var id = req.params.id;

    if (!isNaN(id)) {
        UserModel.getUser(id, function(error, data) {

            if (typeof data !== 'undefined' && data.length > 0) {
                res.render("index", {
                    title: "Formulario",
                    info: data
                });
            } else {
                res.json(404, {
                    "msg": "notExist"
                });
            }
        });
    } else {
        res.json(500, {
            "msg": "The id must be numeric"
        });
    }
});

router.get("/", function(req, res) {

    var token = req.headers.authentification_token;

    if (token) {
        UserModel.getUserToken({
            token: token
        }, function(error, data) {

            res.json(200, data);
        });
    } else {

        UserModel.getUsers(function(error, data) {
            res.json(200, data);
        });
    }
});



router.get("/:id", function(req, res) {

    var id = req.params.id;

    if (!isNaN(id)) {
        UserModel.getUser(id, function(error, data) {

            if (typeof data !== 'undefined' && data.length > 0) {
                res.json(200, data);
            } else {
                res.json(404, {
                    "msg": "notExist"
                });
            }
        });
    } else {
        res.json(500, {
            "msg": "Error"
        });
    }
});


router.post("/", function(req, res) {

    var authentification_code = crypto.randomBytes(16).toString('hex');


    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'leam.90@gmail.com',
            pass: ''
        }

    });

    var mailOptions = {
        from: 'Leandro Bisceglie <leam.90@gmail.com>',
        to: 'leam.90@gmail.com',
        subject: 'Website Submission',
        text: 'you created a new user',
        html: '<p>new user created!... pleace activate in this link <a href=http://localhost:2000/login/activate?hash=' + authentification_code + ' >Activation</a></p>'

    }

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.redirect('/');
        } else {
            console.log('messege sent:' + info.response);
            //       res.redirect('/');
        }
    });

    if (!req.body) {

        res.json(500, {
            "msg": "incorrect request"
        });
    }

    var userData = {

        user: req.body.user,
        email: req.body.email,
        name: req.body.name,
        birthday: req.body.birthday,
        password: req.body.password

    };

    userData.password = crypto.createHash('md5').update(userData.password).digest('hex');

    UserModel.insertUser(userData, function(error, data) {





        //arregla los datos que inserta
        var tokenData = {
            id: authentification_code,
            account_id: data.insertId
        }
        UserModel.insertVerificationCode(tokenData, function(err) {

            if (err) {

                return res.send({
                    title: 'Sign In',
                    errorMessage: err.message
                });
            } else {

                res.send({
                    msj: 'uepa',
                    validation_code: authentification_code
                });
            }
        });
    });
});


router.put("/:id", function(req, res) {

    var userData = {
        id: req.param('id'),
        user: req.param('user'),
        email: req.param('email'),
        name: req.param('name'),
        birthday: req.param('birthday'),
        password: req.param('password')
    };
    var hash = crypto.createHash('md5').update(userData.password).digest('hex');
    console.log(hash);
    userData.password = hash;

    UserModel.updateUser(userData, function(error, data) {

        if (data && data.msg) {
            res.send(data);
        } else {
            res.json(500, {
                "msg": "Error"
            });
        }
    });
});

router.delete("/:id", function(req, res) {

    var id = req.param('id');

    UserModel.deleteUser(id, function(error, data) {
        if (data && data.msg === "deleted" || data.msg === "notExist") {
            res.send(data);
        } else {
            res.json(500, {
                "msg": "Error"
            });
        }
    });

});

module.exports = router