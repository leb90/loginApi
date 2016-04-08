var mysql = require('mysql');

var connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    datebase: 'db1'

});
connection.connect(function(err) {
    if (!err) {
        console.log("Database esta conectada");
        connection.config.queryFormat = function(query, values) {
            if (!values) return query;
            return query.replace(/\:(\w+)/g, function(txt, key) {
                if (values.hasOwnProperty(key)) {
                    return this.escape(values[key]);
                }
                return txt;
            }.bind(this));
        };
    } else {
        console.log("Error no conectando");
    }
});

var userModel = {};

userModel.getUsers = function(callback) {
    if (connection) {
        connection.query('SELECT * FROM apibd.users ORDER BY id', function(error, rows) {
            if (error) {
                throw error;
            } else {
                callback(null, rows);
            }
        });
    }
}


userModel.getUser = function(id, callback) {
    var ob = {
        id: id
    }
    var query = "SELECT * FROM apibd.users WHERE id = :id";
    connection.query(query, ob, function(error, row) {
        if (error) {
            throw error;
        } else {
            callback(null, row);
        }
    });
}
userModel.insertUser = function(userData, callback) {
    console.log(userData);
    if (connection) {
        var ob = {
            username: (userData.username),
            direccion: (userData.direccion),
            telefono: (userData.telefono)
        };

        var sql = 'INSERT INTO apibd.users SET username = :username, direccion = :direccion, telefono = :telefono';


        connection.query(sql, ob, function(err, result) {
            if (err) throw err;

            console.log(result.insertId);
        });
    }
}

userModel.updateUser = function(userData, callback) {



    if (connection) {



        var ob = {
            username: (userData.username),
            direccion: (userData.direccion),
            telefono: (userData.telefono),
            id: (userData.id)
        };

        var sql = "UPDATE apibd.users SET username = :username, direccion = :direccion, telefono = :telefono WHERE id = :id";

        connection.query(sql, ob, function(error, data) {

            if (error) {
                throw error;
            } else {
                callback(null, {
                    "msg": "success"
                });
            }
        });

    }

}

userModel.deleteUser = function(id, callback) {
    if (connection) {
        var obExists = {
            id: id
        }
        var queryExists = "SELECT * FROM apibd.users WHERE id = :id";
        connection.query(queryExists, obExists, function(err, row) {

            if (row) {
                var ob = {
                    id: id
                }
                var query = "DELETE FROM apibd.users WHERE id = :id";
                connection.query(query, ob, function(error, result) {
                    if (error) {
                        throw error;
                    } else {
                        callback(null, {
                            "msg": "deleted"
                        });
                    }
                });
            } else {
                callback(null, {
                    "msg": "notExist"
                });
            }
        });
    }
}


module.exports = userModel;