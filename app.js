var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs')
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()
var session = require('express-session');
const config = require('./config/config');
var swagger  = require('swagger-express');
var underscore = require('underscore');
var http = require('http')

var mysqlLib = require('./utils/db_connection')
baseUrl = "http://localhost:3050/"
s3Url   = "https://locksign-dev.s3.amazonaws.com/"
appkey = "tqXpg6UQZYyG99Yb";
process.on('uncaughtException', function(err){
    var file = __dirname + "/routes/error.txt"
        fs.appendFile(file, err.stack,function (err) {      
    });
})

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json({ extended: false, limit: "80mb"}));
app.use(bodyParser.urlencoded({ extended: false, limit: "80mb"}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multipartMiddleware)
app.use(session({
    key: 'user_sid',
    secret: 'regkjreghhfghruieghuir',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false
    //expires: 60000000
    }
}));

app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    swaggerURL: '/doc',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './public/swagger/',
    basePath: "http://192.168.1.73:3000",
    apis: ['./swagger/users.yml']
  }
));

var Router = require('./routes');
app.use('/', Router);

app.use(function(req, res, next) {
    if (!req.user)
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});
// app.listen(3000, function(){  
//   console.log("Express server listening on port 3000");
// });
app.set('port',config.app.port);
var startServer = http.createServer(app).listen(app.get('port'), function () {
	console.log("Server started at port "+config.app.port+"")
});