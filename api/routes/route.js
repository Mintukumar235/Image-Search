const express = require("express");
const router = express.Router();
const multer = require("multer");
const imageController = require("../controllers/imageController");

const upload = multer({ dest: "uploads/" }); // Set upload destination

router.post("/upload", upload.single("image"), imageController.uploadImage);

router.get("/images/search", imageController.searchImages);

module.exports = router;
