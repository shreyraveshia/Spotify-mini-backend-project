const mongoose = require('mongoose');


const albumSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    musics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'music' // music collection ke andar se hum yaha par id pass karenge.
    }],

    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'artist', // artist collection ke andar se hum yaha par id pass karenge.
        required: true
    }
    
})

const albumModel = mongoose.model('album', albumSchema);

module.exports = albumModel;