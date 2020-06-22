const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.flash("success", "Log you in " + req.user.username);
    next();
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
  }
};

middlewareObj.isAuthorized = function (req, res, next) {
  if (req.isAuthenticated()) {
    const currentUser = req.user._id;

    Blog.findOne({ _id: req.params.id }, function (err, blog) {
      if (currentUser.equals(blog.author.id)) {
        next();
      } else {
        req.flash("error", "You are not authorized to do that");
        res.redirect("/blogs/" + req.params.id);
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/blogs/" + req.params.id);
  }
};

middlewareObj.loginRegisterPermit = function (req, res, next) {
  if (req.isAuthenticated()) {
    // console.log("in login permit");
    req.flash("error", "You need to be logged out to do that..");
    res.redirect("/blogs");
  } else {
    next();
  }
};

middlewareObj.commentEditDeletePermit = function (req, res, next) {
  if (req.isAuthenticated()) {
    const currentUser = req.user._id;

    Comment.findOne({ _id: req.params.comment_id }, function (err, comment) {
      if (currentUser.equals(comment.author.id)) {
        next();
      } else {
        req.flash("error", "You are not authorized to do that");
        res.redirect("back");
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
}

module.exports = middlewareObj;
