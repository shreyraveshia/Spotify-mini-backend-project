const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");


async function registerUser(req, res){

    const {username, email, password, role="user"} = req.body; // req.body mai agar role nahi ata, then role-"user" by default set ho jayega.

    // 


    const isUserAlreadyExists = await userModel.findOne({
// checks for either the condition of username or email, if either of them matches an existing user in the database, it will return that user document.
        $or: [ 
            {username},  
            {email}
        ]

    })

    if(isUserAlreadyExists){
        return res.status(409).json({ message: "User with the same username or email already exists" })
    }

    const hash = await bcrypt.hash(password, 10) // 10 is the salt-- salting adds a unique, randm value to each password before hashing, making brute-force and rainbow attack far more difficult. 
    // plain password which was coming from req.body-usko bcrypt .hash ki madad se hash mai convert kar denge, taki password ko aur secure banaya ja sake,
    // before hashing it, making it more secure against attacks like rainbow table attacks.

    const user = await userModel.create({
        username,
        email,
        password: hash, // is hash password ko database mai store karenge, taki agar database leak bhi ho jaye toh bhi user ke original password ka pata na chale.
        role
    })

    // user create hone ke baad, hume token create karvana hoga

    const token = jwt.sign({
        id: user._id, // token ke andar user ka id aur role store karenge, taki jab bhi user koi request kare toh uske token se hume pata chal jaye ki ye request kis user se aa rahi hai aur uska role kya hai.
        role: user.role
    }, process.env.JWT_SECRET)

    // now we will set token in the cookie
    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

async function loginUser(req, res){

    const {username, email, password} = req.body;
    // in our created schema- we have given unique:true for both username and email, 
    // so user can login with either username or email, dono mai se koi bhi ek use kar 
    // sakta hai login karne ke liye, isliye humne yaha par dono ko accept kiya hai.

    // ie ya to username and pass send karega, ya to email and pass send karega, 

    const user = await userModel.findOne({

        $or: [  // dono mai se koi ek condition satisfy ho jaye- toh we have to consider a user
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(401).json({ message: "invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password) 
    // bcrypt.compare function takes the plain text password provided by the user (and then hashes it) and the hashed password
    // stored in the database, and it checks if they match.
    // It returns true if the passwords match and false otherwise.

    if(!isPasswordValid){
        return res.status(401).json({ message: "invalid credentials" })
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)
    
    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })


}

async function logoutUser(req, res){

    res.clearCookie("token")
    res.status(200).json({ message: "User logged out successfully" })

}

module.exports = { registerUser, loginUser, logoutUser };