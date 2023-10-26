require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')

const corsOptions = {
  origin: 'http://localhost:9000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// app.use(cors(corsOptions));
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { db } = require("./config/db.config");

const posts = db.collection("posts");
const users = db.collection("users");

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

app.post(process.env.BASE_API_URL + "users/sign-up", async (req, res) => {
  var user = req.body;
  user.username = user.username.toLowerCase()
  user.email = user.email.toLowerCase()

  let tempUser = await users.findOne({ email: user.email });
  if (tempUser) {
    res.statusCode = 409
    return res.send("An account is already linked to this email")
  }
  tempUser = await users.findOne({username: user.username})
  if (tempUser) {
    res.statusCode = 409
    return res.send("Username has been taken")
  }

  user = {
    _id: new ObjectId(),
    accountCreated: new Date().getTime(),
    isPrivate: false,
    ...user
  };

  users.insertOne(user);
});

app.post(process.env.BASE_API_URL + "users/login", async (req, res) => {
  var credentials = req.body;

  if (credentials.token) {
    const decodedToken = jwt.verify(credentials.token, process.env.JWT_SECRET)

    if (decodedToken._id 
      && decodedToken.name
      && decodedToken.email
      && decodedToken.username
      ) {
      const token = jwt.sign({
        _id: decodedToken._id,
        name: decodedToken.name,
        email: decodedToken.email,
        username: decodedToken.username,
      }, process.env.JWT_SECRET, {
        expiresIn: "48hr"
      })


      const tempUser = {
        _id: decodedToken._id,
        name: decodedToken.name,
        email: decodedToken.email,
        username: decodedToken.username,
        token: token
      }

      return res.json(tempUser)
    } else {
      res.statusCode = 498
      return res.send("Invalid token")
    }
  }

  credentials.email = credentials.email.toLowerCase()

  let user = await users.findOne({ email: credentials.email });
  if (user) {
    if (user.password !== credentials.password) {
      res.statusCode = 401
      return res.send("Invalid username or password")
    }
  }

  const token = jwt.sign({
    _id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
  }, process.env.JWT_SECRET, {
    expiresIn: "48hr"
  })

  const tempUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    token: token
  };

  res.json(tempUser)
});

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
