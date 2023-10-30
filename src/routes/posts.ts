import { Post } from '../types'
import { Request, Response } from 'express'

const express = require('express')
const cors = require('cors')
const router = express.Router()

const { collections } = require('../config/database.config')

router.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.APP_URL : 'http://localhost:8000',
    methods: ['GET'],
  }),
)

router.get('/', (req: Request, res: Response) => {
  req
  collections.posts
    .find()
    .limit(50)
    .toArray()
    .then((posts: Post) => {
      res.json(posts)
    })
    .catch((e: Error) => console.error(e))
})

// router.post("/", async (req: Request) => {
//   const post = req.body;
//   const user = await collections.users.findOne({
//     username: post.author.username,
//   });
//   post.author = {
//     _id: user._id,
//     ...post.author,
//   };
//   post.timestamp = new Date().getTime();

//   collections.posts.insertOne(post);
// });

export default router
