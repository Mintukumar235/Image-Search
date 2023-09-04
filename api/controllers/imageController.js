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

// exports.searchImages = async (req, res) => {
//   try {
//     const itemsPerPage = 3;
//     const pageNo = req.query.page || 1; // Get the page number from the query parameters
//     const sortBy = req.query.sortBy || "newest"; // Get the sorting option from the query parameters
//     const searchWord = req.query.searchTerm;

//     // Define the sort options based on the sorting parameter
//     let sortOptions = {};
//     if (sortBy === "newest") {
//       sortOptions = { createdAt: -1 }; // Sort by createdAt in descending order (newest first)
//     } else if (sortBy === "oldest") {
//       sortOptions = { createdAt: 1 }; // Sort by createdAt in ascending order (oldest first)
//     } else if (sortBy === "az") {
//       sortOptions = { title: 1 }; // Sort by title in ascending order (A-Z)
//     } else if (sortBy === "za") {
//       sortOptions = { title: -1 }; // Sort by title in descending order (Z-A)
//     }

//     const totalCount = await Image.countDocuments({
//       $or: [
//         { title: { $regex: searchWord, $options: "i" } }, // Case-insensitive match
//         { keywords: { $regex: searchWord, $options: "i" } },
//       ],
//     });
//     const totalPages = Math.ceil(totalCount / itemsPerPage);

//     const images = await Image.find({
//       $or: [
//         { title: { $regex: searchWord, $options: "i" } }, // Case-insensitive match
//         { keywords: { $regex: searchWord, $options: "i" } },
//       ],
//     })
//       .sort(sortOptions)
//       .skip((pageNo - 1) * itemsPerPage)
//       .limit(itemsPerPage)
//       .collation({ locale: "en", caseLevel: true });
// ;
//     let data = { images, totalCount, totalPages };

//     res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while searching for images." });
//   }
// };

exports.searchImages = async (req, res) => {
  try {
    const itemsPerPage = 3;
    const pageNo = req.query.page ? parseInt(req.query.page) : 1;
    const sortBy = req.query.sortBy || "newest";
    const searchWord = req.query.searchTerm;

    let sortOptions = {};
    if (sortBy === "newest") {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === "oldest") {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === "az") {
      sortOptions = { title: 1 };
    } else if (sortBy === "za") {
      sortOptions = { title: -1 };
    }

    const pipeline = [
      {
        $match: {
          $or: [
            { title: { $regex: searchWord, $options: "i" } },
            { keywords: { $regex: searchWord, $options: "i" } },
          ],
        },
      },
      {
        $facet: {
          totalCount: [
            {
              $count: "value",
            },
          ],
          paginatedResults: [
            {
              $sort: sortOptions,
            },
            {
              $skip: (pageNo - 1) * itemsPerPage,
            },
            {
              $limit: itemsPerPage,
            },
           
          ],
        },
      },
    ];

    const [result] = await Image.aggregate(pipeline).collation({
      locale: "en",
      caseLevel: true,
    });;

    const totalCount = result.totalCount[0] ? result.totalCount[0].value : 0;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const images = result.paginatedResults;

    const data = { images, totalCount, totalPages };

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for images." });
  }
};



