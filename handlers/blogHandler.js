const Blog = require("../models/Blog");
const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");

//Create new blog
const createBlog = async (req, res) => {
  try {
    const { title, content, description, category } = req.body;
    const userId = req.user._id;
    const author = userId;
    const user = await User.findById(userId);

    const newBlog = await Blog.create({
      title,
      content,
      description,
      category,
      image: req.file && `/${req.file.path}`,
      author,
    });

    if (newBlog) {
      user.blogs.push(newBlog);
      user.save();

      return res.status(200).send({
        success: true,
        message: "Blog created successfully",
        data: newBlog,
      });
    }
  } catch (error) {
    errorHandler({ error, res });
  }
};

//Fetch all blogs
const fetchAllBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find().populate(
      "author",
      "firstName lastName username profilePicture"
    );

    if (!allBlogs) {
      return res.status(400).send({
        success: false,
        message: "There are no blogs available.",
        data: null,
      });
    }
    return res.status(200).send({
      success: true,
      message: "All blogs fetched successfully",
      data: allBlogs,
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

//Fetch blog by id
const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId).populate(
      "author",
      "firstName lastName username profilePicture"
    );

    if (!blog) {
      return res.status(400).send({
        success: false,
        message: "The requested blog could not be found.",
        data: null,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Blog fetched successfully.",
      data: blog,
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

module.exports = { createBlog, fetchAllBlogs, getBlogById };
