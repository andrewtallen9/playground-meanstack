// app.js

var express = require('express');
var path = require('path');
var url = require('url');
var photos = require('./routes/photos');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyparser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

// setup our connection to Mongoose
require('dotenv').config();
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0-shard-00-00-eykst.mongodb.net:27017,cluster0-shard-00-01-eykst.mongodb.net:27017,cluster0-shard-00-02-eykst.mongodb.net:27017/cscie31?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`);

// set up cookies, sessions, POST form handling, static path
app.use(cookieParser('cscie31-secret'));
app.use(session(
  {
    secret: 'cscie31',
    resave: 'true',
    saveUninitialized: 'true'
  }
));
app.use(bodyparser.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, 'public')));

// initialize the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//set our routes
app.use('/photos', photos);

// redirect to 404 on failure to route
app.use((req, res, next) => {
  res.status = 404;
  res.redirect('/static/404page.html');
});

module.exports = app;