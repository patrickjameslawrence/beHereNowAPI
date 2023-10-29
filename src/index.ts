require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

import posts from "./routes/posts";
import users from "./routes/users";

// const corsOptions = {
//   origin: 'http://localhost:9000',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

const app = express();
app.use(posts);
app.use(users)

// app.use(cors(corsOptions));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
  console.log(`Ready.`);
});
