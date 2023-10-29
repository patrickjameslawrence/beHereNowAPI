const express = require("express");
const cors = require("cors")
const router = express.Router();
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const { collections } = require("../config/database.config");

router.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.APP_URL : "http://localhost:8000",
    methods: [ 'GET' ]
  }),
);


router.post(
  process.env.BASE_API_URL + "users/signup",
  async (req: any, res: any) => {
    var user = req.body;
    user.username = user.username.toLowerCase();
    user.email = user.email.toLowerCase();

    let tempUser = await collections.users.findOne({ email: user.email });
    if (tempUser) {
      res.statusCode = 409;
      return res.send("An account is already linked to this email");
    }
    tempUser = await collections.users.findOne({ username: user.username });
    if (tempUser) {
      res.statusCode = 409;
      return res.send("Username has been taken");
    }

    user = {
      _id: new ObjectId(),
      accountCreated: new Date().getTime(),
      isPrivate: false,
      ...user,
    };

    collections.users.insertOne(user);
  },
);

router.post(
  process.env.BASE_API_URL + "users/login",
  async (req: any, res: any) => {
    var credentials = req.body;

    if (credentials.token) {
      const decodedToken = jwt.verify(
        credentials.token,
        process.env.JWT_SECRET,
      );

      if (
        decodedToken._id &&
        decodedToken.name &&
        decodedToken.email &&
        decodedToken.username
      ) {
        const token = jwt.sign(
          {
            _id: decodedToken._id,
            name: decodedToken.name,
            email: decodedToken.email,
            username: decodedToken.username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "48hr",
          },
        );

        const tempUser = {
          _id: decodedToken._id,
          name: decodedToken.name,
          email: decodedToken.email,
          username: decodedToken.username,
          token: token,
        };

        return res.json(tempUser);
      } else {
        res.statusCode = 498;
        return res.send("Invalid token");
      }
    }

    credentials.email = credentials.email.toLowerCase();

    let user = await collections.users.findOne({ email: credentials.email });
    if (user) {
      if (user.password !== credentials.password) {
        res.statusCode = 401;
        return res.send("Invalid username or password");
      }
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "48hr",
      },
    );

    const tempUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      token: token,
    };

    res.json(tempUser);
  },
);

export default router;
