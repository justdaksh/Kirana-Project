// importing the exported app from express
const app = require("./app");

// Import the connectdatabse
const connectDatabase = require("./config/database");

// importing dotenv
const dotenv = require("dotenv");

// config
dotenv.config({ path: "Backend/config/config.env" });

// connect with database in server after imporing config
connectDatabase()

// TO make the server running
app.listen(process.env.PORT, () => {
    console.log(`server is Working on http://localhost:${process.env.PORT}`);
})