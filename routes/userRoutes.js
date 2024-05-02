const express = require("express");
const { register } = require("../handlers/userHandler");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User Routes");
  console.log("User routes");
});

//Register new user
router.post("/register", register);

module.exports = router;
