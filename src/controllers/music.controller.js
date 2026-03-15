const musicModel = require("../models/music.model");
const { uploadFile } = require("../services/storage.service");
const jwt = require("jsonwebtoken");



async function createMusic(req, res) { // we have to make it protected,; ie only artist can create music, so we will check the role of the user in the middleware, if the role is artist then only we will allow them to create music.


    // whatever request which will be coming here in musicController, where we need to create music

    // toh ab koi si bhi request jab musicController ke createMusic function ko hit karegi, toh

    // we will check, ki us request ke andar, token hai ya nahi, sahi hai ya nahi; 
    // agar token sahi hai, toh us token ke andar se user ki id aur role nikalenge, aur check karenge ki kya role artist hai ya nahi, agar artist hai toh hi music create karne denge, agar artist nahi hai toh music create karne nahi denge.

     const token = req.cookies.token; // token ko cookie se nikalenge, kyunki humne token ko cookie me set kiya hai, toh ab us token ko cookie se nikalna hoga.

        if(!token){
            return res.status(401).json({ message: "Unauthorized" })
        }
        // agar token aata hai, then humko usko verify karna hoga, 

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) // token ko verify karenge, agar token valid hai toh decoded me us token ke andar ka data aa jayega, jisme user ki id aur role hoga, agar token invalid hai toh error throw karega.

            if(decoded.role !== "artist"){
                return res.status(403).json({ message: "You dont have access to create a music" }) // agar role artist nahi hai toh forbidden error bhejenge, kyunki sirf artist hi music create kar sakte hai.
            }

            // agar uske pass sara access rahega, then we will move forward

        } catch (err) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const {title} = req.body;
        const file = req.file; // file ko req.file se nikalenge, kyunki humne multer middleware use kiya hai, toh multer middleware ke through file ko req.file me store kar diya jayega.

        const result = await uploadFile(file.buffer.toString('base64')); 
        // file ko upload karenge, aur uska result nikalenge, jisme file ka url hoga, jisko hum database me store karenge.
        
        const music = await musicModel.create({
            uri: result.url, // file ka url ko uri me store karenge, taki jab bhi music ko play karna ho toh us url se music ko play kar sake.
            title,
            artist: decoded.id // artist me user ki id ko store karenge, taki hume pata chal sake ki kis user ne ye music upload kiya hai.
        })

        res.status(201).json({
            music:{
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        })
}

module.exports = { createMusic }