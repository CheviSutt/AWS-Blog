const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const userRoutes = require('./routes/user');

// const Post = require("./models/post"); // not needed after server route = posts.js

const app = express();

mongoose
  .connect(
    'mongodb+srv://chevi:' + process.env.MONGO_ATLAS_PASSWORD + '@cluster0-txgvm.mongodb.net/blog-post?retryWrites=true' // if err add ?retryWrites=true after /blog-post
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('node-server/images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/posts/", postsRoutes);
app.use("/user/", userRoutes);

module.exports = app;



