import { Request, Response } from 'express'

const express = require('express')
const cors = require('cors')

const router = express.Router()
const { ObjectId } = require('mongodb')

const { CORSOptions } = require('../lib/globals')
const { collections } = require('../config/database.config')

router.use(cors(CORSOptions))

router.post('/create_account', async (req: Request, res: Response) => {
  var body = req.body
  body.username = body.credentials.username.toLowerCase()
  body.email = body.credentials.email.toLowerCase()

  let storedUser = await collections.users.findOne({ email: body.email })
  if (storedUser) {
    res.statusCode = 409
    res.statusMessage = 'An account is already linked to this email'
    return res.send()
  }
  storedUser = await collections.users.findOne({ username: body.username })
  if (storedUser !== null) {
    res.statusCode = 409
    res.statusMessage = "This username isn't available"
    return res.send()
  }

  const date = new Date()

  body = {
    _id: new ObjectId(),
    accountCreated: date,
    accountUpdated: date,
    isPrivate: false,
    credentials: {
      isConfirmed: false,
    },
    ...body,
  }

  collections.users.insertOne(body)
  return res.send(200)
})

router.post('/confirm_email', async (req: Request, res: Response) => {
  var body = req.body
  body.email = body.email.toLowerCase()

  await collections.users.updateOne(
    { email: body.email },
    { $set: { goTrueId: body.goTrueId, 'credentials.isConfirmed': true } },
  )
  return res.send(200)
})

router.post('/accept_invite', async (req: Request, res: Response) => {
  var body = req.body
  body.username = body.credentials.username.toLowerCase()
  body.email = body.credentials.email.toLowerCase()

  let storedUser = await collections.users.findOne({ email: body.email })
  if (storedUser) {
    res.statusCode = 409
    res.statusMessage = 'An account is already linked to this email'
    return res.send()
  }
  storedUser = await collections.users.findOne({ username: body.username })
  if (storedUser !== null) {
    res.statusCode = 409
    res.statusMessage = "This username isn't available"
    return res.send()
  }

  const date = new Date()

  body = {
    _id: new ObjectId(),
    accountCreated: date,
    accountUpdated: date,
    isPrivate: false,
    credentials: {
      isConfirmed: false,
    },
    ...body,
  }

  collections.users.insertOne(body)
  return res.send(200)
})

router.post('/accept_invite/set_goTrue_id', async (req: Request, res: Response) => {
  var body = req.body
  body.email = body.email.toLowerCase()

  let storedUser = await collections.users.findOne({ email: body.email })
  if (storedUser) {
    await collections.users.updateOne(
      { email: body.email },
      { $set: { goTrueId: body.goTrueId, 'credentials.isConfirmed': true } },
    )
    return res.send(200)
  }
  return res.send(500)
})

export default router
