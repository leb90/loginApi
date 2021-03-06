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
        connection.query('SELECT * FROM db1.account ORDER BY id', function(error, rows) {
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
    var query = "SELECT * FROM db1.account WHERE id = :id";
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
            user: (userData.user),
            email: (userData.email),
            name: (userData.name),
            birthday: (userData.birthday),
            password: (userData.password)
        };

        var sql = 'INSERT INTO db1.account SET user = :user, email = :email, password = :password, birthday = :birthday, name = :name';


        connection.query(sql, ob, function(err, result) {
            if (err) throw err;
            callback(err, result);
            console.log(result.insertId);
        });
    }
}

userModel.updateUser = function(userData, callback) {



    if (connection) {



        var ob = {
            user: (userData.user),
            email: (userData.email),
            name: (userData.name),
            birthday: (userData.birthday),
            password: (userData.password),
            id: (userData.id)
        };

        var sql = "UPDATE db1.account SET user = :user, email = :email, password = :password, name = :name, birthday = :birthday WHERE id = :id";

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
        var queryExists = "SELECT * FROM db1.account WHERE id = :id";
        connection.query(queryExists, obExists, function(err, row) {

            if (row) {
                var ob = {
                    id: id
                }
                var query = "DELETE FROM db1.account WHERE id = :id";
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
userModel.getLogUser = function(userData, callback) {
    var ob = {

        user: (userData.user),
        password: (userData.password)

    }
    var query = "SELECT * FROM db1.account WHERE user= :user AND password= :password";
    connection.query(query, ob, function(error, row) {
        if (error) {
            throw error;
        } else {
            callback(null, row);
        }
    });
}

userModel.insertToken = function(userToken, callback) {

    if (connection) {
        var sql = 'INSERT INTO db1.token SET id = :id, account_id = :account_id';
        connection.query(sql, userToken, function(err, result) {

            if (err) {
                throw err;
            } else {
                callback(err, result);
            }
        });
    }
}

userModel.getUserToken = function(userData, callback) {

    if (connection) {
        var sql = "SELECT * FROM db1.token  AS token LEFT JOIN db1.account AS account ON token.account_id = account.id WHERE token.id = :token";
        connection.query(sql, userData, function(err, result) {

            if (err) {
                throw err;
            } else {
                callback(err, result);
            }
        });
    }
}



userModel.deleteToken = function(userData, callback) {
    if (connection) {




        var query = "DELETE FROM db1.token WHERE id = :token";
        connection.query(query, userData, function(error, result) {
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

}

userModel.updateStatusUser = function(userData, callback) {



    if (connection) {



        var sql = "UPDATE db1.account SET status_id = :status_id WHERE id = :id";

        connection.query(sql, userData, function(error, data) {

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

userModel.insertVerificationCode = function(userToken, callback) {

    if (connection) {
        var sql = 'INSERT INTO db1.verification_code SET id = :id, account_id = :account_id';
        connection.query(sql, userToken, function(err, result) {

            if (err) {
                throw err;
            } else {
                callback(err, result);
            }
        });
    }
}
userModel.getVerigicationCode = function(userData, callback) {

    if (connection) {
        var sql = "SELECT * FROM db1.verification_code  AS verification_code LEFT JOIN db1.account AS account ON verification_code.account_id = account.id WHERE verification_code.id = :token";
        connection.query(sql, userData, function(err, result) {

            if (err) {
                throw err;
            } else {
                callback(err, result);
            }
        });
    }
}


userModel.updatePasswordUser = function(userData, callback) {



    if (connection) {



        var ob = {
            password: (userData.password),
            id: (userData.id)

        };

        var sql = "UPDATE db1.account SET password = :password WHERE id = :id";

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


userModel.getEmailUser = function(userData, callback) {
    var ob = {

        email: (userData.email)

    }
    var query = "SELECT * FROM db1.account WHERE email= :email";
    connection.query(query, ob, function(error, row) {
        if (error) {
            throw error;
        } else {
            callback(null, row);
        }
    });
}


userModel.insertMessage = function(userData, callback) {

    if (connection) {
        var ob = {
            account_id: (userData.account_id),
            message: (userData.message)
        };

        var sql = 'INSERT INTO db1.message SET message = :message, account_id = :account_id';


        connection.query(sql, ob, function(err, result) {
            if (err) throw err;
            callback(err, result);
            console.log(result.insertId);
        });
    }
}

userModel.insertResMessage = function(userData, callback) {

    if (connection) {
        var ob = {
            account_id: (userData.account_id),
            message: (userData.message),
            parent_id: (userData.parent_id)
        };

        var sql = 'INSERT INTO db1.message SET message = :message, account_id = :account_id, parent_id = :parent_id';


        connection.query(sql, ob, function(err, result) {
            if (err) throw err;
            callback(err, result);
            console.log(result.insertId);
        });
    }
}

userModel.getMessage = function(userData, callback) {


    var ob = {
        id: (userData.id)
    }

    if (connection) {
        var sql = "SELECT * FROM db1.message  AS message LEFT JOIN db1.account AS account ON message.account_id = account.id WHERE db1.account.id = :id";
        connection.query(sql, ob, function(error, row) {

            if (error) {
                throw error;
            } else {
                callback(error, row);
            }
        });
    }
}


userModel.getTree = function(callback) {


    if (connection) {
        connection.query('SELECT db1.message.id AS id, db1.account.id AS account_id, db1.message.message, db1.message.created_at, db1.message.parent_id, db1.account.user FROM db1.message LEFT JOIN db1.account ON message.account_id = account.id ORDER BY message.created_at', 
            function(error, rows) {


            if (error) {
                throw error;
            } else {
                callback(null, rows);
            }
        });
    }
}

module.exports = userModel;