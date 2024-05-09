const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    image: { type: String },
    category: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

blogSchema.methods.toggleLike = async function (userId) {
  const index = this.likes.indexOf(userId);
  if (index === -1) {
    // User has not liked the blog, add like
    this.likes.push(userId);
  } else {
    // User has liked the blog, remove like
    this.likes.splice(index, 1);
  }
  await this.save();
};

blogSchema.methods.toggleSave = async function (userId) {
  const index = this.saves.indexOf(userId);
  if (index === -1) {
    // User has not liked the blog, add like
    this.saves.push(userId);
  } else {
    // User has liked the blog, remove like
    this.saves.splice(index, 1);
  }
  await this.save();
};

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
