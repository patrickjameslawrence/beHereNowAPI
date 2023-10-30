import { ObjectId } from 'mongodb'
import { Countries, StatesAndProvinces } from './lib/globals'

type Post = {
  _id: ObjectId
  author: User
  content: string
  location: Location
  timestamp: Date
}
type Location = {
  isUsing: boolean
  latitude: number
  longitude: number
}

type User = {
  _id: ObjectId
  accountCreated: Date
  isPrivate: boolean
  name: string
  credentials: Credentials
  city?: string
  stateOrProvince?: StatesAndProvinces
  country?: Countries
}
type Credentials = {
  username: string
  email: string
  password: string
}
