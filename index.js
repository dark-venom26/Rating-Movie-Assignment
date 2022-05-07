const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const movieRoute = require('./routes/movie')
const authRoute = require('./routes/auth')

dotenv.config();

mongoose.connect(process.env.MONGO_URL, ()=>{
    console.log("Connected to mongoDB successfully");
})

const port = 5000;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Routes
app.use("/api/movie", movieRoute)
app.use("/api/auth", authRoute)

app.listen(port, ()=>{
    console.log(`Crazy Media Backend server running on http://localhost:${port}`);
})