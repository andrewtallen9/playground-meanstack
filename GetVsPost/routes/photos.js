// photos.js

var express = require('express');
var router = express.Router();
var app = express();
var multer = require('multer');
var photoController = require('../controllers/photoController');
var flash = require('connect-flash');

// lets us use flash messages
router.use(flash());

// defines where the multer middlewear will place images
// dest lets multer handle everything
//var upload = multer({dest: 'public/img/'});

// storage gives us more control about how/where we put files
// filter lets us approve/reject files
var upload = multer({ storage: photoController.storage, fileFilter: photoController.imageFilter });

// app.locals is just a memory store
// if server stops/starts, this will be empty
if (!app.locals.photolist) {
    app.locals.photolist = [];
};

router.get('/', (req, res, next) => {

    res.render('userphotos', {
        photos: app.locals.photolist,
        // this asks for the message associated to fileUploadError (if it exists)
        // when you access it, it will DELETE IT FROM SESSION
        // if you need it more than once, SAVE IT OFF
        flashMsg: req.flash('fileUploadError')
    });

    console.log('placeholder');
});

// POST requests need the req.on('data') as the data of the request is separate from the POST request object
// upload.single is multer middlewear
// so this post router will call upload.single first, then call our callback function
router.post('/', upload.single('image'), (req, res, next) => {
    // build formdata as an example of how to get POST data
    //var formdata = '';
    //req.on('data', (d) => {
    //    formdata += d;
    //});
    //req.on('end', () => {
    //    console.log(formdata);
    //});

    // lets use bodyparser instead to do it all for us!
    var photo = {
        title: req.body.title,
        description: req.body.description,
        imageurl: '/static/img/' + req.file.filename
    }

    // adds photo object to photolist
    app.locals.photolist.push(photo);

    // redirect the user back to photos for display
    res.redirect('/photos');
});

// If we have a function that starts with an err argument, this will get called if any middlewear encounters an unhandled error
router.use(function (err, req, res, next) {
    console.error(err.stack);
    if (err.message == 'OnlyImageFilesAllowed') {
        // this sends a response
        //res.send('Please select an image file (.jpg, .png, or .gif)');

        // this is using flash to send a message (not a response)
        // this is setting up the message on the request
        req.flash('fileUploadError', 'Please select an image file (.jpg, .png, or .gif)');
        res.redirect('/photos');
    } else {
        next(err);
    }
});

module.exports = router;