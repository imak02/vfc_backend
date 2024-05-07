const express = require("express");
const {
  register,
  login,
  verifyEmail,
  getCurrentUser,
  fetchUser,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../handlers/userHandler");
const { checkAuth } = require("../middlewares/checkAuth");
const { profilePicMiddleware } = require("../middlewares/profilePic");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User Routes");
  console.log("User routes");
});

//Register new user
router.post("/register", register);

//Verify Email
router.post("/verify", verifyEmail);

//Login
router.post("/login", login);

//Get current user
router.get("/current-user", checkAuth, getCurrentUser);

//Get user with userId
router.get("/:userId", fetchUser);

//Update user profile
router.put(
  "/update-profile/:userId",
  checkAuth,
  profilePicMiddleware,
  updateUser
);

//Change Password
router.put("/change-password", checkAuth, changePassword);

//Forgot Password
router.post("/forgot-password", forgotPassword);

//Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
