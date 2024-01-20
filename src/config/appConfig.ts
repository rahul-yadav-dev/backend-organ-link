import dotenv from 'dotenv'
import { Environment } from '../types/environment'
dotenv.config()

const env: Environment = <any>process.env
export const App = {
  port: env.PORT || 3000,
}

export const Mongo = {
  url: env.MONGO_URL,
}

export const EmailConfig = {
  user: process.env.EMAIL_USER || 'cornsub.now@gmail.com',
  pass: process.env.EMAIL_APP_PASS || 'uhwr rznf zvsn yxwq',
}

export const JwtConfig = {
  key: process.env.JWT_KEY || 'ASFKJHASFJASLKFJS',
}

export const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET,
}

export const twilioConfig = {
  username: process.env.TWILIO_USER,
  password: process.env.TWILIO_PASS,
  number: process.env.TWILIO_NUMBER,
}

export const thresholdRadiusForMessage = process.env.THRESHOLD_RADIUS || 50
