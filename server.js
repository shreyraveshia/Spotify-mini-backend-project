// we run server here

require('dotenv').config(); // taki .env file se environment variables load ho jaye. 
const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB(); // database se connect karte hai.

app.listen(3000, () => {
    console.log("Server is running at port 3000");
})