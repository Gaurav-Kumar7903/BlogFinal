const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const express = require("express");
const flash = require("connect-flash");
const Blog = require("./models/Blog");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/User");
const app = express();

const indexRoute = require("./routes/index");
const blogRoute = require("./routes/blog");
const commentRoute = require("./routes/comment");

const url = "mongodb://localhost/RESTBlog";
mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    if (err) {
      console.log("mongo error");
    } else {
      console.log("db connected");
    }
  }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  require("express-session")({
    secret: "Gaurav is a handsome boy",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoute);
app.use(blogRoute);
app.use(commentRoute);

// Blog.create({
//   title: "Mai hu don ji",
//   image:
//     "https://timesofindia.indiatimes.com/thumb/msid-69914063,width-1200,height-900,resizemode-4/.jpg",
//   content: "don ko pakrna muskil hi nhi namumkin hai",
// });

app.get("*", (req, res) => {
  res.send("Page Not Found");
});
const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
  console.log("server started");
});
