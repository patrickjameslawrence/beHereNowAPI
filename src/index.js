require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const corsOptions = {
  origin: 'http://localhost:9000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { db } = require("./config/db.config");

const posts = db.collection("posts");
const users = db.collection("users");

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get(process.env.BASE_API_URL + "posts", (req, res) => {
  posts
    .find()
    .toArray()
    .then((posts) => {
      res.json(posts);
    });
});

app.post(process.env.BASE_API_URL + "posts", async (req, res) => {
  const post = req.body;
  const user = await users.findOne({ username: post.author.username });
  post.author = {
    _id: user._id,
    ...post.author,
  };
  post.timestamp = new Date().getTime();

  posts.insertOne(post);
});

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
