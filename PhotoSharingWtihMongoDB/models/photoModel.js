// photoModel.js

var mongoose = require('mongoose');

// get access to the Schema constructor
var Schema = mongoose.Schema;

// create our photo schema
var schema = new Schema({
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    filename: { type: String, required: true },
    imageurl: { type: String, required: true },
    description: { type: String, required: false },
    title: { type: String, required: true },
    size: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});

// mongoose 'middlewear' to update fields before a save takes place
schema.pre('save', function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    } else {
        this.updatedAt = new Date();
    };
    next();
});

// export the model with associated name and schema
module.exports = mongoose.model('Photo', schema);