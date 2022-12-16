const mongoose = require("mongoose");
mongoose.set('strictQuery', true); //done to handle the mongoose 7 strictquery 
// Connecting databse
const connectDatabse = () => {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }).then((data) => {
        console.log(`MongoDB connected to server : ${data.connection.host}`);
    })
}

module.exports = connectDatabse;