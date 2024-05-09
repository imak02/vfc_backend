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

//Edit blog
const editBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, description, category, content } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    const blog = await Blog.findById(blogId);
    if (userId != blog.author) {
      return res.status(400).send({
        success: false,
        message: "Unauthorized request",
        data: null,
      });
    }

    const editedBlog = await Blog.findByIdAndUpdate(
      { _id: blogId },
      {
        title,
        description,
        category,
        image: req.file && `/${req.file.path}`,
        content,
        author: userId,
      },
      { new: true }
    );

    if (editedBlog) {
      return res.status(200).send({
        success: true,
        message: "Blog edited successfully",
        data: editedBlog,
      });
    }
  } catch (error) {
    errorHandler({ error, res });
  }
};

//Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user._id;
    const user = await User.findById(userId);

    const blog = await Blog.findById(blogId);
    if (userId != blog.author) {
      return res.status(400).send({
        success: false,
        message: "Unauthorized request",
        data: null,
      });
    }

    const deleted = await Blog.findByIdAndDelete(blogId);

    if (deleted) {
      user.blogs.pop(deleted);
      user.save();
      return res.status(200).send({
        success: true,
        message: "Blog deleted successfully.",
        data: null,
      });
    }
  } catch (error) {
    errorHandler({ error, res });
  }
};

//Get blogs by author Id
const getBlogByAuthor = async (req, res) => {
  try {
    const authorId = req.params.authorId;

    const blogs = await Blog.find({ author: authorId }).populate("author");

    if (!blogs) {
      return res.status(400).send({
        success: false,
        message: "There are no blogs available",
        data: null,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Blogs fetched successfully.",
        data: blogs,
      });
    }
  } catch (error) {
    errorHandler({ error, res });
  }
};

//Like a blog
const likeBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.blogId;

    const blog = await Blog.findById(blogId);
    await blog.toggleLike(userId);

    return res.status(200).send({
      success: true,
      message: "Action was successful",
      data: null,
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

//Save blog
const saveBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.blogId;

    const blog = await Blog.findById(blogId);
    await blog.toggleSave(userId);

    return res.status(200).send({
      success: true,
      message: "Action was successful",
      data: null,
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};

//Get liked blogs of User
const getLikedBlog = async (req, res) => {
  try {
    const userId = req.user._id;

    const blogs = await Blog.find({ likes: userId }).populate("author");

    if (blogs) {
      return res.status(200).send({
        success: true,
        message: "Blogs fetched successfully",
        data: blogs,
      });
    } else {
      return res.status(400).send({
        success: true,
        message: "There are no blogs available",
        data: null,
      });
    }
  } catch (error) {
    errorHandler({ error, res });
  }
};

//Get saved blogs of User
const getSavedBlog = async (req, res) => {
  try {
    const userId = req.user._id;

    const blogs = await Blog.find({ saves: userId }).populate("author");
    if (blogs) {
      return res.status(200).send({
        success: true,
        message: "Blogs fetched successfully",
        data: blogs,
      });
    } else {
      return res.status(400).send({
        success: true,
        message: "There are no blogs available",
        data: null,
      });
    }
  } catch (error) {
    errorHandler({ error, res });
  }
};

module.exports = {
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
};
