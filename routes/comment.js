const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const middlewareObj = require("../middleware");

router.get("/blogs/:id/comments/new", middlewareObj.isLoggedIn, function (
    req,
    res
) {
    res.render("comments/new", { blog_id: req.params.id });
});

router.post("/blogs/:id/comments", middlewareObj.isLoggedIn, function (
    req,
    res
) {
    const comment = new Comment({
        message: req.body.message,
        author: { id: req.user._id, username: req.user.username }

    });
    comment.save();
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            res.redirect("back");
        } else {
            blog.comments.push(comment._id);
            blog.save();
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

router.get("/blogs/:id/comments/:comment_id/edit", middlewareObj.commentEditDeletePermit, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            return res.redirect("back");
        }
        res.render("comments/update", { blog_id: req.params.id, comment: comment });
    })

})

router.put("/blogs/:id/comments/:comment_id", middlewareObj.commentEditDeletePermit, (req, res) => {
    const editedComment = {
        message: req.body.message,
        author: { id: req.user._id, username: req.user.username }
    }
    Comment.findByIdAndUpdate(req.params.comment_id, editedComment, (err, comment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

router.delete("/blogs/:id/comments/:comment_id", middlewareObj.commentEditDeletePermit, (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            return res.redirect("back");
        }
        // console.log(req.params.comment_id);
        blog.comments.remove(req.params.comment_id);
        blog.save();
    })
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if (err) {
            return res.redirect("back");
        }
        res.redirect("/blogs/" + req.params.id);
    })

})

module.exports = router;
