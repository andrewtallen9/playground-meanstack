// app-asynch.js

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0-shard-00-00-eykst.mongodb.net:27017,cluster0-shard-00-01-eykst.mongodb.net:27017,cluster0-shard-00-02-eykst.mongodb.net:27017/cscie31?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`);

var db = mongoose.connection;

// lets set up an event listener
// in order to use await keyword, the calling function must be described as async
db.on('open', async function () {
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
    // lets use await to have better organized code (instead of nested callbacks)
    // the promise goes to await, and await returns what the promise would have returned
    //  so we can put it into a variable and use it
    // we can also put a try/catch around the entire block to process errors in *any* part of it!
    try {
        var c = await c1.save();
        console.log('saved:')
        console.log(c);

        var characters = await Character.find({});
        console.log('found:');
        console.log(characters);
    } catch (err) { console.err(err) }

}).catch((err) => {
    console.error(`${err} errored out!`);
});
