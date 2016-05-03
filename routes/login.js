var UserModel = require('../models/users');
var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var passport = require('passport');
var client = require('./client');
var login = require('./login');

router.delete("/logOut", function(req, res) {

    var token = req.headers.cookie;

    if (token) {
        UserModel.deleteToken({
            token: token
        }, function(error, data) {
            if (data && data.msg === "deleted" || data.msg === "notExist") {
                res.send(data);
            } else {
                res.json(500, {
                    "msg": "Error"
                });
            }
        });

    }
});


router.get("/activate", function(req, res) {


    var token = req.query.hash

    UserModel.getVerigicationCode({
        token: token
    }, function(error, data) {

        var userData = {
            id: data[0].id,
            status_id: "2"
        };

        /////////////////////////////////////////////////////////////
        UserModel.updateStatusUser(userData, function(error, data) {

            if (data && data.msg) {
                res.send(data);
                res.redirect('/signin');
            } else {
                res.json(500, {
                    "msg": "Error"
                });
            }
        });
    });
});
///////////////////////////////////////////



// sign in
// GET
router.get('/signin', function(req, res, next) {
    if (req.isAuthenticated()) res.redirect('/list');
    res.render('signin.html', {
        title: 'Sign In'
    });

});
// sign in
// POST
router.post('/signin', function(req, res, next) {

    var userData = {

        user: req.body.user,
        password: req.body.password
    };

    var hash = crypto.createHash('md5').update(userData.password).digest('hex');

    userData.password = hash;

    passport.authenticate('local', {
            successRedirect: '/list',
            failureRedirect: '/'

        },
        UserModel.getLogUser(userData, function(error, user) {
            if (error) {
                return res.json(500, {
                    "msg": "Error"
                });

            }
            if (!user) {
                return res.json(500, {
                    "msg": "Error"
                });

            }


            if (user[0].status_id != 2) {
                return res.json(500, {
                    "msg": "Error"
                });

            }

            var token = crypto.randomBytes(16).toString('hex');

            //arregla los datos que inserta
            var tokenData = {
                id: token,
                account_id: user[0].id
            }

            UserModel.insertToken(tokenData, function(err) {

                if (err) {

                    return res.json(500, {
                        "msg": "Error"
                    });
                } else {

                    res.send({
                        msj: 'Sign In',
                        token: token

                    });
                }
            });
        }));
});


router.get("/recoverpasswd", function(req, res) {

    res.render("recoverpassword.html", {
        title: "Formulario para crear un nuevo recurso"
    });
});

router.put("/recoverpasswd", function(req, res) {



    var token = req.query.hash

    UserModel.getVerigicationCode({
        token: token
    }, function(error, data) {

        var userData = {
            id: data[0].id,
            password: req.body.password

        };
        var hash = crypto.createHash('md5').update(userData.password).digest('hex');

        userData.password = hash;



        /////////////////////////////////////////////////////////////
        UserModel.updatePasswordUser(userData, function(error, result) {
            console.log(result)
            if (!result) {
                return res.json(500, {
                    "msg": "Error"
                });

            }

            
        });
    });
});

router.get("/recover", function(req, res) {
    res.render("email.html", {
        title: "Formulario para crear un nuevo recurso"
    });
});

router.post('/recover', function(req, res, next) {

    var authentification_code = crypto.randomBytes(16).toString('hex');


    var userData = {

        email: req.body.email
    };

    UserModel.getEmailUser(userData, function(error, user) {
        if (error) {
            return res.json(500, {
                "msg": "Error"
            });
        }
        if (!user) {
            return res.json(500, {
                "msg": "Error"
            });
        }
        /////////////////////////////mailer       
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
            html: '<p>new user created!... pleace activate in this link <a href=http://localhost:2000/login/recoverpasswd?hash=' + authentification_code + ' >Activation</a></p>'

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


        ////////////////////////////mailer////////////////////

        var tokenData = {
            id: authentification_code,
            account_id: user[0].id
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


    })
});


module.exports = router