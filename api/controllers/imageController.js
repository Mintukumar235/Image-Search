const Image = require("../models/Image");

exports.uploadImage = async (req, res) => {
  try {
    // Get data from request body
    const { title, description, keywords } = req.body;

    // Create a new image record in the database
    const newImage = new Image({
      title,
      description,
      keywords: keywords.split(",").map((keyword) => keyword.trim()), // Split keywords and trim whitespace
      filename: req.file.filename, // File saved by multer
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while uploading the image." });
  }
};

exports.searchImages = async (req, res) => {
  try {
    const itemsPerPage = 10;
    let searchWord = req.query.searchTerm;
    let { sortByDate = "createdAt", pageNo = 1 } = req.query;
    const images = await Image.find({
      $or: [
        { title: { $regex: searchWord, $options: "i" } }, // Case-insensitive match
        { keywords: { $regex: searchWord, $options: "i" } },
      ],
    })
      .sort({ [sortByDate]: 1 })
      .skip((pageNo - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.status(200).json(images);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for images." });
  }
};
