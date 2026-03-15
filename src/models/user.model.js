const mongoose = require('mongoose');

// we will first create - userSchema-> then Model-> then api/route-> then controller

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true, // to create any user in our DB then , we need to give username(this is work of required)
        unique: true   // all users should have unique username, no two users can have same username. (this is work of unique)
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    
    role:{
        type: String,
        enum: ['user', 'artist'],
        default: 'user'
    }
})

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;