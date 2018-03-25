// app.js

var express = require('express');
var path = require('path');
var users = require('./routes/users');

// when we require express, we are importing a function which builds an express object
// so call that function to add an express object to our variable
// note: if we named the require something else (like expModule), the function call also changes (since we are calling the function by a variable)
var app = express();

// setting up PUG as our view engine (included in Express by default!)
// first, set views to the absolute path to the views folder
// then set pug as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// hello world middleware
//app.use(function (req, res, next){
//    res.end('Hello express! I\'m a statement!');
//});

// delivering static files
// we could just use express.static('public'), but that is a relative path
// the following will be an absolute path (which means we can call it no matter where node is running)
// we can have as many of the following lines as we want - each checking a separate folder
// however, the will go through all of those checks *every time*, which can be a performance issue!
//app.use(express.static(path.join(__dirname,'public')));

// so, we can use the following - a virtual path
//  if a url comes in with /static, try to serve it from public
//  so only the urls with /static use this express line
app.use('/static', express.static(path.join(__dirname, 'public')));

// for routing, we need a way to extract important infromation from the URL to understand where to go/create the correct response
// routing is the use of creating request handlers to handle each case

// Express has a function for each of the (23!) different request types
// the most common are get, post, put, and delete
// ORDER OF THE .get MATTERS
//  get - enter a URL
//app.get('/', (req, res) => {
//    res.end('root requested');
//});

/* Doing routing in app.js - not the best

app.get('/users', (req,res) => {
    res.end('/users requested');
});

// things like :userid is a route parameter
// :userid maps to req.params.userid
// therefore, route parameters show up in req.params
app.get('/users/:userid', (req,res) => {
    res.end(`/users requested, userid ${req.params.userid}`);
});

// you can have more than 1
app.get('/users/:userid/photos/:photoid', (req,res) => {
    res.end(`/users requested, userid ${req.params.userid}, /photos requested, photoid ${req.params.photoid}`);
});

// things like ?format=thumbnail is a query string
//  they can be strung together (?format=jpg&size=thumbnail)
//  therefore, query string paramters show up in req.query
app.get('/photos/:photoid', (req,res) => {
    res.end(`/photos requested, photoid ${req.params.photoid}, format ${req.query.format} and size ${req.query.size}`);
});

// error handler middleware that will send a stack trace
//app.use((req,res,next) => {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});
*/

// lets route using the MVC model with a routes folder
// anything with the users path will use the users module/router
//app.use('/users', users);

// error handler middleware that will be a redirect
app.use((req, res, next) => {
    res.status = 404;
    //send a line instead if we want
    //res.send('Sorry, this file cannot be found');
    res.redirect('/static/404page.html');
});

module.exports = app;