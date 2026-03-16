const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");


const { uploadFile } = require("../services/storage.service");
const jwt = require("jsonwebtoken");



async function createMusic(req, res) { 

// we have to make it protected,; ie only artist can create music, 
// so we will check the role of the user in the middleware, 
// if the role is artist then only we will allow them to create music.

// whatever request which will be coming here in musicController, where we need to create music
// toh ab koi si bhi request jab musicController ke createMusic function ko hit karegi, toh

// we will check, ki us request ke andar, token hai ya nahi, sahi hai ya nahi; 
// agar token sahi hai, toh us token ke andar se user ki id aur role nikalenge, 
// aur check karenge ki kya role artist hai ya nahi, agar artist hai toh hi music create 
// karne denge, agar artist nahi hai toh music create karne nahi denge.

/*
     const token = req.cookies.token; 
     // [we will get token from "req.cookies.token", 
     // kyunki humne token ko cookie me set kiya hai, 
     // toh ab us token ko cookie se nikalna hoga.]

        if(!token){
            return res.status(401).json({ message: "Unauthorized" })
        } 
        // means user ne login ya register nahi kiya.


        // agar token aata hai, then humko usko verify karna hoga, 
        // -> and to verify, we need a package called jwt, so we will install jwt package, 
        // and then we will use jwt.verify() function to verify the token, 
        // and if the token is valid, then we will get the decoded data from the token, 
        // which will contain the user's id and role, and then we will check if the role is artist 
        // or not, if it is artist then we will allow them to create music, 
        // otherwise we will return a forbidden error.

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) 

            // token: This is the actual JWT string that the client 
            // (e.g., a web browser or mobile app) sends to the server, 
            // usually in the Authorization: Bearer <token> header of an HTTP request.

// process.env.JWT_SECRET: This is the secret key (or public key, depending on the algorithm) used for signing and verifying the token's signature.
// This key is stored securely on the server, typically as an environment variable to prevent it from being exposed in the source code.
// The jwt.verify() method uses this secret to re-calculate the token's signature and compares it with the signature provided in the token itself. If they don't match, the token is considered invalid or tampered with.


            
            // jwt.verify() function se token ko verify karenge, 
            // aur uske andar hum secret key denge, jo ki process.env.JWT_SECRET me stored hai,
            // secret key ko use karke jwt.verify() function token ko verify karega, 
            
            // aur agar token valid hai toh decoded me us token ke andar ka data aa jayega, 
            // jisme user ki id aur role hoga, agar token invalid hai toh error throw karega.
            
            // token ko verify karenge, agar token valid hai toh decoded me 
            // us token ke andar ka data aa jayega, jisme user ki id aur role hoga, 
            // agar token invalid hai toh error throw karega.

            if(decoded.role !== "artist"){
                return res.status(403).json({ message: "You dont have access to create a music" }) // agar role artist nahi hai toh forbidden error bhejenge, kyunki sirf artist hi music create kar sakte hai.
            }

            // agar uske pass sara access rahega, then we will move forward

*/

        // to create music, we need to have few things
        const {title} = req.body;
        const file = req.file; 
        // file ko req.file se nikalenge, kyunki humne multer middleware use kiya hai,
        // toh multer middleware ke through file ko req.file me store kar diya jayega.

        const result = await uploadFile(file.buffer.toString('base64')); 
        
        // file ko upload karenge -> to the imagekit , aur uska result nikalenge, jisme file ka url hoga,
        // jisko hum database me store karenge.


        const music = await musicModel.create({
            uri: result.url, // file ka url ko uri me store karenge, 
            // taki jab bhi music ko play karna ho toh us url se music ko play kar sake.
            title,
            artist: req.user.id // 
            // artist me user ki id ko store karenge, 
            // taki hume pata chal sake ki kis user ne ye music upload kiya hai.
        })

        res.status(201).json({
            music:{
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
      })
/*
        } catch (err) {

            console.log(err);
            return res.status(401).json({ message: "Unauthorized" })
        }
*/
}

async function createAlbum(req, res){

/*
    // first of all we will check- album jo create kar raha hai woh ek artist rahe ga, 
    // and to check it, we will do token thing, 


    const token = req.cookies.token;

        if(!token){
            return res.status(401).json({ message: "Unauthorized" })
        }

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            if(decoded.role !== "artist"){
                return res.status(403).json({ message: "You dont have access to create a album" }) 
                // agar role artist nahi hai toh forbidden error bhejenge, kyunki sirf artist hi album create kar sakte hai.
            }

*/

    // if it is artist then we will allow them to create album,

    // to create album we will be having/coming title and musics, 
    // musics me hum music ke id ko store karenge, taki hume pata chal sake ki kaunse music kis album me hai.

            const {title, musics} = req.body; // req.body me se title aur musicIds ko nikalenge, musicIds me music ke id honge, jisko hum album me store karenge.// req.body mai se title aur musicIds ko nikalenge, musicIds me music ke id honge, jisko hum album me store karenge.

            const album = await albumModel.create({
                title,
                musics: musics, 
                artist: req.user.id
            })

            res.status(201).json({
                message: "Album created successfully",
                album: {
                    id: album._id,
                    title: album.title,
                    musics: album.musics,
                    artist: album.artist
                }
            })
/*
        }
            catch(err){
                console.log(err);
                return res.status(401).json({ message: "Unauthorized" })
            }
*/

}

async function getAllMusics(req, res){


    const musics = await musicModel
    .find()
    .skip(0)
    .limit(2)
    .populate("artist", "username email"); 
    // musicModel se saare music ko find karenge, aur unke andar artist ki information 
    // ko populate karenge, taki hume pata chal sake ki kaunse music kis artist ne upload kiya hai.
    // populate means- [saari info aa jana]artist ki poori information aa jayegi.

    res.status(200).json({
        message: "Music fethed Successfully",
        musics: musics,
    })
    
}

async function getAllAlbums(req, res){

    const albums = await albumModel.find().select("title artist").populate("artist", "username email")
    // albumModel se saare album ko find karenge, aur unke andar artist ki information 
    // ko populate karenge, taki hume pata chal sake ki kaunse album kis artist ne create kiya hai.
    // aur musics ki information ko bhi populate karenge, taki hume pata chal sake ki kaunse album me kaunse music hai.

    res.status(200).json({
        message: "Albums fetched successfully",
        albums: albums
    })
}

async function getAlbumById(req, res){

    const albumId = req.params.albumId; // req.params me se albumId ko nikalenge, taki hume pata chal sake ki kaunse album ki information chahiye.

    const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics");
    // albumModel se album ko find karenge, aur uske andar artist ki information ko populate karenge, taki hume pata chal sake ki kaunse album kis artist ne create kiya hai.
    // aur musics ki information ko bhi populate karenge, taki hume pata chal sake ki kaunse album me kaunse music hai.
    
    return res.status(200).json({
        message: "Album fetched successfully",
        album: album
    })
}


module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById };