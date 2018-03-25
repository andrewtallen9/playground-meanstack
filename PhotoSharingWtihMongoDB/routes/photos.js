// photos.js

var express = require('express');
var router = express.Router();
var app = express();
var multer = require('multer');
var photoController = require('../controllers/photoController');
var flash = require('connect-flash');
var Photo = require('../models/photoModel');

// sets up flash usage
router.use(flash());

// define how multer will handle our files
var upload = multer({ storage: photoController.storage, fileFilter: photoController.imageFilter });

// router for general get requests
router.get('/', (req, res, next) => {

    // Search the database for our photos
    Photo.find({})
        .then((photos) => {
            res.render('userphotos', {
                photos: photos,
                flashMsg: req.flash('fileUploadError')
            });
        })
        .catch((err) => {
            if (err) {
                res.end('ERROR!');
            }
        });
});

// router for individual photo get requests
router.get('/:photoid', (req, res, next) => {
    console.log('Finding ' + req.params.photoid);
    Photo.findOne({ '_id': req.params.photoid })
        .then((photo) => {
            res.render('updatePhoto', {
                photo: photo,
                flashMsg: req.flash('photoFindError')
            });
        });
});

// router for individual photo post requests
router.post('/:photoid', (req, res, next) => {
    Photo.findOne({ '_id': req.params.photoid })
        .then((photo) => {
            var data = {
                title: req.body.title,
                description: req.body.description
            };
            // updates the fields based on the object literal we defined
            photo.set(data);
            photo.save().then(() => {
                res.redirect('/photos');
            })
        }).catch((err) => {
            if (err) {
                res.end('ERROR!');
            }
        });
});

// router for general post requests
router.post('/', upload.single('image'), (req, res, next) => {

    // get the file path for the photo
    var path = '/static/img/' + req.file.filename;

    // get the metadata for the photo
    var photo = {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        imageurl: path,
        title: req.body.title,
        filename: req.file.filename,
        description: req.body.description,
        size: req.file.size / 1024 | 0
    };

    // update our photo variable
    var photo = new Photo(photo);

    // save our photo!
    photo.save()
        .then(() => {
            res.redirect('/photos');
        })
        .catch((err) => {
            if (err) {
                console.error(err);
                throw new Error('PhotoSaveError', photo);
            }
        });
});

// If we have a function that starts with an err argument, this will get called if any middlewear encounters an unhandled error
router.use(function (err, req, res, next) {
    console.error(err.stack);
    if (err.message == 'OnlyImageFilesAllowed') {
        req.flash('fileUploadError', 'Please select an image file (.jpg, .png, or .gif)');
        res.redirect('/photos');
    }
    else if (err.message == 'PhotoSaveError') {
        req.flash('photoSaveError', 'There was a problem saving your photo.');
        res.redirect('/photos');
    }
    else {
        next(err);
    }
});

module.exports = router;