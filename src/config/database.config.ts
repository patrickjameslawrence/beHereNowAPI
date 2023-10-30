const { MongoClient } = require('mongodb')
require('dotenv').config()

const mongoClient = new MongoClient(process.env.MONGO_DB_URI)

async function connect() {
  try {
    return await mongoClient.connect()
  } catch (e) {
    console.error(e)
  }
}

const connection = connect()

var db
try {
  db = mongoClient.db(process.env.DB)
} catch (e) {
  console.error(e)
}

var collections
try {
  collections = {
    posts: db.collection('posts'),
    users: db.collection('users'),
  }
} catch (e) {
  console.error(e)
}

module.exports = { collections }
