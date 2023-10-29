require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

import posts from "./routes/posts";
import users from "./routes/users";

const app = express();
app.use(process.env.BASE_API_URL + "posts", posts);
app.use(process.env.BASE_API_URL + "users", users);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
  console.log("Ready");
});
