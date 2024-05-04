const express = require("express");
const {
  register,
  login,
  verifyEmail,
  getCurrentUser,
} = require("../handlers/userHandler");
const { checkAuth } = require("../middlewares/checkAuth");
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

module.exports = router;
