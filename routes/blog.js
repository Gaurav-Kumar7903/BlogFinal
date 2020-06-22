const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const middlewareObj = require("../middleware");
const Comment = require("../models/Comment");

router.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) console.log("error happens in searching");
    else {
      // console.log(req.user);
      res.render("index", {
        blogs: blogs,
      });
    }
  });
});

router.get("/blogs/new", middlewareObj.isLoggedIn, (req, res) => {
  res.render("blogs/new");
});

router.post("/blogs", middlewareObj.isLoggedIn, (req, res) => {
  Blog.create(req.body.blog, (err, blog) => {
    if (err) throw err;
    else {
      blog.author.username = req.user.username;
      blog.author.id = req.user._id;
      blog.save();
    }
  });
  res.redirect("/blogs");
});

router.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id).populate("comments").exec((err, blog) => {
    if (err) console.log("blog not found");
    else res.render("blogs/show", { blog: blog });
  });
});

router.get("/blogs/:id/edit", middlewareObj.isAuthorized, (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) console.log("blog not found in post");
    else res.render("blogs/update", { blog: blog });
  });
});
router.put("/blogs/:id", middlewareObj.isAuthorized, (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      console.log("error occurs while updating");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});
router.delete("/blogs/:id", middlewareObj.isAuthorized, (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      return res.redirect("back");
    }
    blog.comments.forEach((comment) => {
      Comment.findByIdAndRemove(comment, (err) => {
        if (err) {
          return res.redirect("back");
        }

      })
    })
  })
  Blog.findByIdAndDelete(req.params.id, (err) => {
    if (err) console.log("error occur while deleting");
    else {
      res.redirect("/blogs");
    }
  });
});

module.exports = router;
