require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const npmPackage = require('../package.json')

import { CORSOptions } from './lib/globals'

import posts from './routes/posts'
import users from './routes/users'

const app = express()

if (!process.env.BASE_API_URL || !npmPackage.version) {
  throw new Error('Cannot form API url')
}

const apiUrl = process.env.BASE_API_URL + '/v' + npmPackage.version
app.use(apiUrl + '/posts', posts)
app.use(apiUrl + '/users', users)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors(CORSOptions))

app.listen(process.env.PORT, () => {
  console.log(
    '[' +
      new Date().toLocaleTimeString() +
      ']' +
      ' BeHereNow API v-' +
      process.env.npm_package_version +
      ' ready. Allowing ' +
      process.env.NODE_ENV +
      ' origins',
  )
})
