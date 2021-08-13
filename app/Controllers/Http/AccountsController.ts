import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken'
import User from 'App/Models/User'

export default class AccountsController {
  public async recover({ request, response }: HttpContextContract) {
    const { authorization } = request.headers()

    if (!authorization)
      return response.unauthorized({
        code: 401,
        message: 'Invalid bearer token',
      })

    const decrypt: any = jwt.verify(
      authorization?.split(' ')[1],
      Env.get('JWT_SECRET')
    )

    const user = await User.findBy('id', decrypt.user.id)

    if (!user)
      return response.unauthorized({
        code: 401,
        message: 'Invalid bearer token',
      })

    if (!user.active)
      return response.unauthorized({
        code: 401,
        message: 'Account is not active',
      })

    return response.ok(user)
  }
}
