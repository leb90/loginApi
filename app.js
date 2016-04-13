var express = require('express');

var bodyParser = require('body-parser');
var routesIndex = require('./routes/index');
var http = require('http');
var path = require('path');
var methodOverride = require('method-override');
var app = express();
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//userModel
var UserModel = require('./models/users');

app.set('port', process.env.PORT || 2000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hogan-express'));

app.use(function(req, res, next) {
    var oneof = false;
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization, Content-Type, Accept, Origin");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }
    if (req.method == 'OPTIONS')
        res.status(200).send();
    else
        next();
});



app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(express.static(path.join(__dirname, '/public')));

app.use("/", routesIndex);

app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));



if ('development' == router.get('env')) {
    app.use(express.errorHandler());
}


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password'

},
    function(username, password, done) {

        //       new Model.User({
        //           
        //       }).fetch().then(function(data) {
        UserModel.getLogUser(userData, function(error, data) {
            if (typeof data !== 'undefined' && data.length > 0) {
                res.json(200, data);
            } else {
                res.json(404, {
                    "msg": "notExist"
                });
            }
            username: username

            var user = data;
            if (user === null) {
                return done(null, false, {
                    message: 'Invalid username or password'
                });
            } else {
                user = data.toJSON();
                if (!crypto.createHash('md5').update(userData.password).digest('hex')) {
                    return done(null, false, {
                        message: 'Invalid username or password'
                    });
                } else {
                    return done(null, user);
                }
            }
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.username);
});





//require('./routes')(app);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
module.exports = app;