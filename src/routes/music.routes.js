const express = require('express');
const musicController = require('../controllers/music.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage() 
    // file ko memory me store karenge, 
    // taki hum us file ko directly upload kar sake imagekit me,
    // bina us file ko server me save kiye.
})

const router = express.Router();

router.post("/upload", authMiddleware.authArtist, upload.single("music") ,musicController.createMusic); 
// "upload.single("music")"- means we are expecting a single file with the field name "music" 
// in the request, toh multer middleware us file ko req.file me store kar dega, aur uske 
// baad musicController.createMusic function ko call karega.


router.post("/album", authMiddleware.authArtist , musicController.createAlbum);

// middleware ke through hum ye check karenge ki jo user album create kar raha hai woh artist hai ya nahi, 
// agar artist hai toh usko album create karne ka access denge, aur agar artist nahi hai toh usko access deny kar denge,
// aur to check karne ke liye hum token ka use karenge, toh authMiddleware.authArtist middleware me hum token ko verify karenge,
// aur agar token valid hai toh usme se user ki id aur role nikalenge, aur agar role artist hai toh next() function ko call karenge, taki request aage badh sake,
// aur agar role artist nahi hai toh forbidden error bhejenge, kyunki sirf artist hi album create kar sakte hai.
// aur agar token invalid hai toh unauthorized error bhejenge, kyunki token invalid hone par hume pata nahi chalega ki user kaun hai, toh usko access deny kar denge.

// album create karne ke liye bhi ek route banayenge, jisme musicController.createAlbum function ko call karenge.


router.get("/", authMiddleware.authUser, musicController.getAllMusics);

// is api pe-> normal user: jitne bhi music hamare server pe create hue honge,
// woh saare music yaha pe sun sakta hain.

router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums);

router.get("/albums/:albumId", authMiddleware.authUser, musicController.getAlbumById);


module.exports = router;