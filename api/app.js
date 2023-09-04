const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const imageApiRoute = require("./routes/route");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB using the DB_URL from .env
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", async () => {
  console.log("MongoDB database connection established successfully");
});
// Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", imageApiRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
