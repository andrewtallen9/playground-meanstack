// app.js

var express = require('express');
var path = require('path');
var url = require('url');
var photos = require('./routes/photos');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// module to help us parse POST requests
var bodyparser = require('body-parser');

var app = express();

app.use(cookieParser('cscie31-secret'));
app.use(session(
    {
      secret: 'cscie31',
      resave: 'true',
      saveUninitialized: 'true'
    }
  ));

// install bodyparser as middleware
// we are only parsing urls, which uses only name-value pairs, we dont need extended to be true (which gives us the ability to use the qs library)
app.use(bodyparser.urlencoded({extended: false}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/photos', photos);

app.use((req, res, next) => {
    res.status = 404;
    res.redirect('/static/404page.html');
});

module.exports = app;