const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer');
const cloudinary = require('cloudinary');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

////////------ Cloudinary Configuration ------//////////
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: true }));

//////----- Database Connection -----//////
require("./database/conn");

////////-------- Routes --------/////////
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

// API Routes
app.use("/api", userRoutes);
app.use("/api", blogRoutes);

// Health Check
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});
