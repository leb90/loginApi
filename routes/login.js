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
        UserModel.getLogUser(userData, function(err, user, info) {
            if (err) {
                return res.send({
                    title: 'Sign In',
                    errorMessage: err.message
                });
            }

            if (!user) {
                return res.send({
                    title: 'Sign In',
                    errorMessage: info.message
                });
            }
            console.log(user[0].status_id)
         
            if (user[0].status_id != 2 ) {
                return res.send({
                    title: 'Sign In',
                    errorMessage: info.message
                })
            }

            var token = crypto.randomBytes(16).toString('hex');

            //arregla los datos que inserta
            var tokenData = {
                id: token,
                account_id: user[0].id
            }

            UserModel.insertToken(tokenData, function(err) {

                if (err) {

                    return res.send({
                        title: 'Sign In',
                        errorMessage: err.message
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
module.exports = router