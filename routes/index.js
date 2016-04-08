var UserModel = require('../models/users');

var express = require('express');
var router = express.Router();


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

router.get("/create", function(req, res){
	res.render("create.html",{ 
		title : "Formulario para crear un nuevo recurso"
	});
});
router.get("/edit", function(req, res){
	res.render("edit.html",{ 
		title : "Formulario para crear un nuevo recurso"
	});
});

router.get("/delete", function(req, res){
	res.render("delete.html",{ 
		title : "Formulario para eliminar un recurso"
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
    if (!req.body) {

        res.json(500, {
            "msg": "incorrect request"
        });
    }
    var userData = {
        id: null,
        username: req.body.username,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        created_at: null,
        updated_at: null
    };

    UserModel.insertUser(userData, function(error, data) {

        if (data && data.insertId) {
            //res.json(200,{"msg":"Gato era esto"});
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
        username: req.param('username'),
        direccion: req.param('direccion'),
        telefono: req.param('telefono')
    };
    console.log(req.param.id)
    
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

module.exports = router