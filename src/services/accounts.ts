import User from '../model/User'
import { ApiResponse } from '../types/response.type'
import { Role } from '../types/role.enum'
import { emailSchema, roleSchema } from '../validation/zodValidation'
import otpgen from 'otp-generator'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { UtilService } from './utils'
import { JwtConfig } from '../config/appConfig'

export type UserRegisterRequest = {
  name: string
  email: string
  role: Role
  contact?: number
  state?: string
  city?: string
  zipCode?: string
  lat?: number
  nabh?:string
  lng?: number
}

export class AccountService {
  constructor() {}

  async registerAccount(userReq: UserRegisterRequest): Promise<ApiResponse> {

    try {
      if (!(userReq.name && userReq.email && userReq.role)) {
        return { status: 400, data: { message: 'Bad Request' } }
      }

      const emailValidation = emailSchema.safeParse(userReq.email)
      const roleValidation = roleSchema.safeParse(userReq.role)

      if (!(emailValidation.success && roleValidation.success)) {
        return {
          status: 400,
          data: { message: 'Bad Request, check email/role values' },
        }
      }

      const existingUser = await User.findOne({ email: userReq.email })

      if (existingUser) {
        return {
          status: 409,
          data: { message: 'User with this email already present' },
        }
      }

      const randomPass = otpgen.generate(8, {})
      console.log(userReq)
      const createdUser = await User.create({
        email: userReq.email,
        nabh:userReq.nabh,
        name: userReq.name,
        password: crypto.createHash('md5').update(randomPass).digest('hex'),
        contact: userReq.contact,
        role: userReq.role,
        city: userReq.city,
        state: userReq.state,
        zipCode: userReq.zipCode,
        isVerified: false,
        isDeleted: false,
        lat: userReq.lat,
        lng: userReq.lng,
      })

      const utilService = new UtilService()
      utilService.sendEmail(userReq.email, randomPass)
      return { status: 200, data: createdUser }
    } catch (error) {
      console.error('Error occured when trying to register', error)
      return { status: 500, data: { message: 'Internal Server Error' } }
    }
  }

  public async loginUser(
    email: string,
    password: string
  ): Promise<ApiResponse> {
    if (!(email && password)) {
      return { status: 400, data: { message: 'Bad Request' } }
    }

    const userData = await User.findOne({ email, isDeleted: false })

    if (userData) {
      const hashedPass = crypto.createHash('md5').update(password).digest('hex')

      if (userData.password === hashedPass) {
        const token = jwt.sign(userData.id, JwtConfig.key)
        return { status: 200, data: { token, user: userData } }
      }
    }

    return { status: 404, data: { message: 'User not found' } }
  }
}
