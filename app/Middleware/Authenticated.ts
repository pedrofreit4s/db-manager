import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken'

export default class Authenticated {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const { authorization } = request.headers()
    if (!authorization)
      return response.unauthorized({
        code: 401,
        message: 'Invalid bearer token',
      })

    const token = authorization.split(' ')[1]
    try {
      jwt.verify(token, Env.get('JWT_SECRET'))
      await next()
    } catch (error) {
      return response.unauthorized({
        code: 401,
        message: 'Invalid bearer token',
      })
    }
  }
}
