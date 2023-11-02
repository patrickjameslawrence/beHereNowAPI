import { ObjectId } from 'mongodb'
import { Countries, StatesAndProvinces } from './lib/globals'

type Post = {
  _id: ObjectId
  author: {
    _id: ObjectId
    credentials: Credentials
  }
  content: Content
  location: Location
  timestamp: Date
}
type Content = {
  text: string
  location: Location
}
type Location = {
  isUsing: boolean
  latitude: number
  longitude: number
}

type User = {
  _id: ObjectId
  accountCreated: Date
  accountUpdated?: Date
  isPrivate: boolean
  name: string
  credentials: Credentials
  city?: string
  stateOrProvince?: StatesAndProvinces
  country?: Countries
  blocked?: {
    users: ObjectId[]
    posts: ObjectId[]
  }
}
type Credentials = {
  netlifyId: string
  username: string
  email: string
}
