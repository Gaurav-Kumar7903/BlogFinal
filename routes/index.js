const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const middlewareObj = require("../middleware");

router.get("/", (req, res) => {
  res.redirect("/blogs");
});

router.get("/login", middlewareObj.loginRegisterPermit, (req, res) => {
  res.render("login");
});

// router.post(
//   "/login",
//   middlewareObj.loginRegisterPermit,
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   }),
//   (req, res) => { }
// );

router.post("/login", middlewareObj.loginRegisterPermit, (req, res) => {
  // if (!req.isAuthenticated()) {
  passport.authenticate("local", (err, user, info) => {
    // console.log("in post login route");
    if (err) {
      // console.log(err);
      return req.flash("error", err.message);
    }
    if (!user) {
      // *** Display message using Express 3 locals
      // req.session.message = info.message;
      //   console.log(info.message);
      req.flash("error", info.message);
      return res.redirect("/login");
    }

    req.logIn(user, function (err) {
      if (err) {
        // console.log("hie");
        req.flash("error", err.message);
        return res.redirect("/login");
      }
      req.flash("success", "welcome " + req.user.username);
      return res.redirect("/blogs");
    });
  })(req, res);
  // } else {
  //   req.flash("error", "you need to logged out to do that");
  //   res.redirect("/blogs");
  // }
});

router.get("/register", middlewareObj.loginRegisterPermit, (req, res) => {
  res.render("register");
});

router.post("/register", middlewareObj.loginRegisterPermit, (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        // console.log("username already exist");
        req.flash("error", err.message);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          //write function here
          req.flash("success", "you are now a member ");
          res.redirect("/logout");
        });
      }
    }
  );
});

router.get("/logout", middlewareObj.isLoggedIn, (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!!");
  res.redirect("/blogs");
});

module.exports = router;
