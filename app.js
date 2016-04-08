var express = require('express');

var bodyParser = require('body-parser');
var routesIndex = require('./routes/index');
var http = require('http');
var path = require('path');
var methodOverride = require('method-override');
var app = express();
var router = express.Router();

app.set('port', process.env.PORT || 2000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hogan-express'));

app.use(function(req, res, next) {
    var oneof = false; 
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization, Content-Type, Accept, Origin");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }
    if (req.method == 'OPTIONS')
            res.status(200).send();
    else
    next();
    });

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static(path.join(__dirname, '/public')));

app.use("/",routesIndex);

app.use(methodOverride(function(req, res){
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
 
//require('./routes')(app);
 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
module.exports = app;