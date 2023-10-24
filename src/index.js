require('dotenv').config()
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { db } = require('./config/db.config')

const posts = db.collection('posts')
const users = db.collection('users')

app.get(process.env.BASE_API_URL + "posts", (req, res) => {
  posts.find().toArray().then((posts) => {
		res.json(posts);
	});
})

app.post(process.env.BASE_API_URL + "posts", async (req, res) => {
  const post = req.body
  const user = await users.findOne({ username: post.author.username })
  post.author = {
    _id: user._id,
    ...post.author
  }
  post.timestamp = new Date().getTime()

  posts.insertOne(post)
})

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`)
})