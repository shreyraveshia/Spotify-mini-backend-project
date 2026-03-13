const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');

const musicRoutes = require('./routes/music.routes');

const app = express();
app.use(express.json()); // taki req.body mai data aa sake.
app.use(cookieParser()); // taki cookie mai hum data set kar sake & jo data cookie se ayega use hum read kar sake.


app.use("/api/auth", authRoutes); // auth related routes ke liye.
app.use("/api/music", musicRoutes); // music related routes ke liye.

module.exports = app;