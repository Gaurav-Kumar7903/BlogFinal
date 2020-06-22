const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  content: String,
  date: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;
