const express = require("express");
const router = express.Router();

const { collections } = require("../config/database.config");

router.get(process.env.BASE_API_URL + "posts", (res: any) => {
  collections.posts
    .find()
    .toArray()
    .then((posts: any) => {
      res.json(posts);
    });
});

router.post(process.env.BASE_API_URL + "posts", async (req: any) => {
  const post = req.body;
  const user = await collections.users.findOne({
    username: post.author.username,
  });
  post.author = {
    _id: user._id,
    ...post.author,
  };
  post.timestamp = new Date().getTime();

  collections.posts.insertOne(post);
});

export default router;
