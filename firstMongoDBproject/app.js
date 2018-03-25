// app.js

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0-shard-00-00-eykst.mongodb.net:27017,cluster0-shard-00-01-eykst.mongodb.net:27017,cluster0-shard-00-02-eykst.mongodb.net:27017/cscie31?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`);

var db = mongoose.connection;

// lets set up an event listener
db.on('open', function () {
    console.log('Connected!');

    // define our Schema
    var characterSchema = mongoose.Schema({
        name: { type: String, required: true },
        role: { type: String, required: false },
        story: String
    });

    // this will map our Schema to a collection in the database
    var Character = mongoose.model('Character', characterSchema);

    // lets get back our data
    // in the first argument, we can search for specific things
    //  you can use multiple parameters!
    //  you can pass a regular expression!
    // leave it blank to get all
    Character.find({ story: 'The Pacific Journal of Adam Ewing' }, (err, characters) => {
        if (err) {
            console.log(err);
        } else {
            console.log('found:');
            console.log(characters);
        };
    });

    // you can also chain .where() to further refine your searches
    // when you are ready to execute, call .exec() and place your callback function there
    Character.find({ story: 'The Pacific Journal of Adam Ewing' })
        .where('role').equals('Lawyer')
        .exec((err, characters) => {
            if (err) {
                console.log(err);
            } else {
                console.log('found:');
                console.log(characters);
            };
        });

    // you can also sort!
    // '-name' will be a decending sort on the name attribute (Z to A)
    Character.find({})
        .sort('-name')
        .exec((err, characters) => {
            if (err) {
                console.log(err);
            } else {
                console.log('found:');
                console.log(characters);
            };
        });

// catch the error!
}).catch((err) => {
    console.error(`${err} errored out!`);
});

//  Basic creation / getting / deleting commmands!
//    // this will create a record in our Schema
//    var c1 = new Character({
//        name: 'Freddy Byron',
//        role: 'Ship Captain',
//        story: 'The Pacific Journal of Adam Ewing'
//    });
//
//    // time to save the character
//    c1.save((err, c) => {
//        if (err) {
//            console.log(err);
//        } else {
//            console.log('saved:')
//            console.log(c);
//       };
// lets get back our data
// we need it here because these callbacks are asynchronous
//  so we don't want to find before the save is done!
//Character.find({}, (err, characters) => {
//    if (err) {
//        console.log(err);
//    } else {
//        console.log('found:');
//        console.log(characters);
//    };
//    // let delete our data
//    // we need it here because these callbacks are asynchronous
//    //  so we don't want to remove before the find is done!
//    characters[0].remove((err) => {
//        console.log('removed record');
//    });
//});
//    });