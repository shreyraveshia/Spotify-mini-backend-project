const jwt = require("jsonwebtoken");



async function authArtist(req, res, next) {

    // auth middleware ka kaam hai ki user ke request me se token nikalna,
    // us token ko verify karna, aur agar token valid hai toh next() function ko call karna, 
    // taki request aage badh sake, aur agar token invalid hai toh error bhejna.

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

                req.user = decoded; // agar token valid hai toh decoded token me se user ki information ko req.user me store karenge, taki aage chal kar hum us user ki information ko use kar sake.

                next(); // agar token valid hai toh next() function ko call karenge, taki request aage badh sake.
            }
            catch(err){
                console.log(err);
                return res.status(401).json({ message: "Unauthorized" })
            }
}

module.exports = { authArtist };