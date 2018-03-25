// app-promise.js

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

    // Basic creation / getting / deleting commmands!
    // this will create a record in our Schema
    var c1 = new Character({
        name: 'Freddy Byron',
        role: 'Ship Captain',
        story: 'The Pacific Journal of Adam Ewing'
    });

    // time to save the character
    // lets use promises to have better organized code (instead of nested callbacks)
    c1.save()
        .then((c) => {
            console.log('saved:')
            console.log(c);
        })
        .then(() => {
            Character.find({}, (err, characters) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('found:');
                    console.log(characters);
                };
            })
                .catch((err) => {
                    console.error(err);
                });
        });
    // catch the error!
}).catch((err) => {
    console.error(`${err} errored out!`);
});
