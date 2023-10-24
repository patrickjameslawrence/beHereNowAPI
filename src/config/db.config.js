const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient("mongodb+srv://patricklawrence:WestChester22&@shouter.wqyhcat.mongodb.net/?retryWrites=true&w=majority");

let conn;
try {
  conn = client.connect();
} catch (e) {
  console.error(e);
}

let db = client.db(process.env.DB);

module.exports = { db };