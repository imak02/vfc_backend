const express = require("express");
const {
  createBlog,
  fetchAllBlogs,
  getBlogById,
  editBlog,
  deleteBlog,
  getBlogByAuthor,
  likeBlog,
  saveBlog,
  getLikedBlog,
  getSavedBlog,
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

//Liked blog of user
router.get("/liked", checkAuth, getLikedBlog);

//Saved blog of user
router.get("/saved", checkAuth, getSavedBlog);

//Get blog by author
router.get("/author/:authorId", getBlogByAuthor);

//Get blog by id
router.get("/:blogId", getBlogById);

//Edit blog
router.put("/:blogId", checkAuth, blogPicMiddleware, editBlog);

//Delete blog
router.delete("/:blogId", checkAuth, deleteBlog);

//Like blog
router.post("/:blogId/like", checkAuth, likeBlog);

//Save blog
router.post("/:blogId/save", checkAuth, saveBlog);

module.exports = router;
