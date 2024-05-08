const express = require("express");
const {
  createBlog,
  fetchAllBlogs,
  getBlogById,
} = require("../handlers/blogHandler");
const { blogPicMiddleware } = require("../middlewares/blogPic");
const { checkAuth } = require("../middlewares/checkAuth");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Blog Routes");
  console.log("Blog routes");
});

//Create new blog
router.post("/new", checkAuth, blogPicMiddleware, createBlog);

//Fetch all blogs
router.get("/all", fetchAllBlogs);

//Get blog by id
router.get("/:blogId", getBlogById);

module.exports = router;
