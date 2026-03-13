const {imagekit} = require("@imagekit/nodejs")

const ImageKitClient = new ImageKit({

    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})


async function uploadFile(file){

    const result = await ImageKitClient.files.upload({

        file, // file can be a base64 string or a buffer or a stream.
        fileName: "music_" + Date.now(),
        folder: "yt-complete-backend/music"
    })
    return result;
}

module.exports = { uploadFile }