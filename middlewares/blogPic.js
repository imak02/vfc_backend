const multer = require("multer");
const { blogMulterStorage, multerFilter } = require("../utils/multer");
const errorHandler = require("../utils/errorHandler");
//File Upload logic
const upload = multer({
  storage: blogMulterStorage,
  fileFilter: multerFilter,
});
const uploadBlogPicture = upload.single("image");

const blogPicMiddleware = async (req, res, next) => {
  uploadBlogPicture(req, res, (error) => {
    if (error) {
      return errorHandler({ message: error.message, res });
    }
    next();
  });
};

module.exports = { blogPicMiddleware };
