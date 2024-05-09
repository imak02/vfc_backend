const express = require("express");
const {
  createBlog,
  fetchAllBlogs,
  getBlogById,
  editBlog,
  deleteBlog,
  getBlogByAuthor,
} = require("../handlers/blogHandler");
const { blogPicMiddleware } = require("../middlewares/blogPic");
const { checkAuth } = require("../middlewares/checkAuth");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Blog Routes");
  console.log("Blog routes");
});

//Fetch all blogs
router.get("/all", fetchAllBlogs);

//Create new blog
router.post("/new", checkAuth, blogPicMiddleware, createBlog);

//Get blog by id
router.get("/:blogId", getBlogById);

//Edit blog
router.put("/:blogId", checkAuth, blogPicMiddleware, editBlog);

//Delete blog
router.delete("/:blogId", checkAuth, deleteBlog);

//Get blog by author
router.get("/author/:authorId", getBlogByAuthor);

module.exports = router;
