const mongoose = require('mongoose');

// we will first create - userSchema-> then Model-> then api/route-> then controller

const musicSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
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

const musicModel = mongoose.model("user", musicSchema);

module.exports = musicModel;