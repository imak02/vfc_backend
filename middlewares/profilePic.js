const multer = require("multer");
const { profileMulterStorage, multerFilter } = require("../utils/multer");
const errorHandler = require("../utils/errorHandler");
//File Upload logic
const upload = multer({
  storage: profileMulterStorage,
  fileFilter: multerFilter,
});
const uploadProfilePicture = upload.single("profilePicture");

const profilePicMiddleware = async (req, res, next) => {
  uploadProfilePicture(req, res, (error) => {
    if (error) {
      return errorHandler({ message: error.message, res });
    }
    next();
  });
};

module.exports = { profilePicMiddleware };
