const express = require('express');
const musicController = require('../controllers/music.controller');

const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage() 
    // file ko memory me store karenge, 
    // taki hum us file ko directly upload kar sake imagekit me,
    // bina us file ko server me save kiye.
})

const router = express.Router();

router.post("/upload", upload.single("music") ,musicController.createMusic); 
// "upload.single("music")"- means we are expecting a single file with the field name "music" 
// in the request, toh multer middleware us file ko req.file me store kar dega, aur uske 
// baad musicController.createMusic function ko call karega.


router.post("/album", musicController.createAlbum);
// album create karne ke liye bhi ek route banayenge, jisme musicController.createAlbum function ko call karenge.


module.exports = router;