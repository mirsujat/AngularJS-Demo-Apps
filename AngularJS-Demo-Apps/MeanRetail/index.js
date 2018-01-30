require('dotenv').load()
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var wagner = require('wagner-core');

require('./server/models/models')(wagner);
require('./server/services/dependencies')(wagner);

var app = express();
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));





app.use(wagner.invoke(require('./server/auth/auth')(app)(wagner)));
//app.use('/auth', require('./server/auth/auth')(wagner) );

// serve static files from file system
app.use(express.static('./client', {maxAge: 4 * 60 * 60 * 1000 } ) );

app.use('/api/v1', require('./server/api/api')(wagner) );

// frontend routes
app.get('/', function(req, res){
  res.sendFile('./client/index.html');
});
app.get('*', function(req, res){
  res.sendFile('./client/index.html');
});

//app.use('/static', express.static(path.join(__dirname, 'client')))

app.listen(3000);
console.log('Server Listening on Port 3000 !');