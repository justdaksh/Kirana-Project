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

// Handling Uncaught Exception #keep it about all console logs
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting Down Server Due to Uncaught Exception`);
    process.exit(1);
})



// TO make the server running
const server = app.listen(process.env.PORT, () => {
    console.log(`server is Working on http://localhost:${process.env.PORT}`);
})
// Unhandeled Promise Rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting Down the Server Due to Unhandeled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
});