import { ObjectId } from 'mongodb'
import { Countries, StatesAndProvinces } from './lib/globals'

type Post = {
  _id: ObjectId
  author: {
    _id: ObjectId
    name: string
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
  goTrueId?: string
  accountCreated: Date
  accountUpdated: Date
  isPrivate: boolean
  name: string
  credentials: Credentials
  city?: string
  stateOrProvince?: StatesAndProvinces
  country?: Countries
  posts: {
    authored?: Post[]
    liked?: Post[]
    reposted?: Post[]
    bookmarked?: Post[]
  }
  blocked?: {
    users: ObjectId[]
    posts: ObjectId[]
  }
}
type Credentials = {
  username: string
  email: string
  isConfirmed: boolean
}
