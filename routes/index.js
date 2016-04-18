var UserModel = require('../models/users');
var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var passport = require('passport');

router.get("/client/update/:id", function(req, res) {
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


router.get("/list", function(req, res) {
    res.render("index.html", {
        title: "Formulario para crear un nuevo recurso"
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

router.get("/client", function(req, res) {
    console.log("tirando datos")
    UserModel.getUsers(function(error, data) {
        res.json(200, data);
    });
});



router.get("/client/:id", function(req, res) {

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


router.post("/client", function(req, res) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'leam.90@gmail.com',
            pass: '35410287talizorah'
        }

    });

    var mailOptions = {
        from: 'Leandro Bisceglie <leam.90@gmail.com>',
        to: 'leam.90@gmail.com',
        subject: 'Website Submission',
        text: 'you created a new user',
        html: '<p>new user created!...</p>'

    }

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.redirect('/');
        } else {
            console.log('messege sent:' + info.response);
            res.redirect('/');
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

        if (data && data.insertId) {

            res.redirect("/client/" + data.insertId);
        } else {
            res.json(500, {
                "msg": "Error"
            });
        }
    });
});


router.put("/client/:id", function(req, res) {

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

router.delete("/client/:id", function(req, res) {

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


///////////////////////////////////////////

var index = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/signin');
    } else {

        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();
        }
        res.render('index', {
            title: 'Home',
            user: user
        });
    }
};

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
                return res.render('signin', {
                    title: 'Sign In',
                    errorMessage: err.message
                });
            }

            if (!user) {
                return res.render('signin', {
                    title: 'Sign In',
                    errorMessage: info.message
                });
            }


            var token = crypto.randomBytes(32).toString('hex');

            //arregla los datos que inserta
            var tokenData = {
                id: token,
                account_id: user[0].id
            }
            UserModel.insertToken(tokenData, function(err, data) {

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



// sign out
// router.get('/signout', function(req, res, next) {
//     if (!req.isAuthenticated()) {
//         res.render('user.html', {
//             title: 'here'
//         });
//     } else {
//         req.logout();
//         res.redirect('/signin');
//     }
// });





// signin
// GET
//route.get('/signin', route.signIn);
// POST
//  route.post('/signin', route.signInPost);

module.exports = router