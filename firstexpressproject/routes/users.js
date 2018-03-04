// users.js
// this will be a router for user-relate request

var express = require('express');
// this sets up the express router
var router = express.Router();

// VERY IMPORTANT - THE PATH IN HERE IS RELATIVE TO THE ROUTES FOLDER
// recall that in app.js, the command was app.get('/users', (req,res) => {});
router.get('/', (req, res, next) => {
    // send simple text
    //res.end('/users requested');
    // lets use a view instead!
    //res.render('user');
    // lets use a view and send it arguments!
    //res.render('user', {'username':'Andrew'});

    res.locals.localtest = 'thisIsLocal';
    res.render('user', {
        'username': 'Andrew',
        photo: {
            title: 'My Photo Title',
            description: 'All about my photo'
        },
        photos: [
            { title: "Photo 1", description: "Description 1" },
            { title: "Photo 2", description: "Description 2" },
            { title: "Photo 3", description: "Description 3" }
        ]
    });
});

router.get('/profile', (req, res, next) => {
    res.end('/users/profile requested');
});

router.get('/:userid', (req, res) => {
    //res.end(`/users requested, userid ${req.params.userid}`);
    res.render('user', { 'username': req.param('userid') });
});

// export our router!
module.exports = router;