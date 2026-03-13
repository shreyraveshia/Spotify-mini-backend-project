const mongoose = require('mongoose'); // Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

const musicSchema = new mongoose.Schema({

    uri:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    artist:{
        type: mongoose.Schema.Types.ObjectId,   // kis artist ne ye music upload kiya hai, uska id store kar dena hai.
        ref: "user", // User model ka reference dena hai, taki hume pata chal sake ki kis user ne ye music upload kiya hai.
        required: true
    }   // artist in the end is particularly a user. Artist ki detail user collection me jake save ho rahi hogi.
        // isliye hume user collection ka reference dena hoga, taki hume pata chal sake ki kis user ne ye music upload kiya hai.
})

const musicModel = mongoose.model("music", musicSchema);

module.exports = musicModel;