// photoController.js

var multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const imageFilter = function (req, file, cb) {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        // convention is to pass an error in the first argument, any other values in the second+ arguments
        cb(null, true);
    } else {
        cb(new Error("OnlyImageFilesAllowed"), false);
    }
}

module.exports.storage = storage;
module.exports.imageFilter = imageFilter;