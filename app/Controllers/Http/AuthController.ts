import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import AuthenticatorUserValidator from 'App/Validators/AuthenticatorUserValidator'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'
import UserActive from 'App/Models/UserActive'
import Hash from '@ioc:Adonis/Core/Hash'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import * as date from 'date-fns'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class AuthController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(CreateUserValidator)
    const body = request.body()

    if (!body.name.split(' ')[1])
      return response.status(400).json({
        code: 400,
        message: 'Digite o seu nome completo',
      })

    if (await User.findBy('email', body.email))
      return response.status(409).json({
        code: 409,
        message: 'Esse e-mail já foi cadastrado no nosso sistema',
      })

    const user = await User.create(body)
    const token = crypto.randomBytes(22).toString('hex')
    await UserActive.create({
      user_id: user.id,
      token,
      expiresIn: date.add(new Date(), {
        hours: 6,
      }),
    })

    await Mail.send((message) => {
      message
        .from('pedroteste@season.ovh')
        .to(user.email)
        .subject('Bem-vindo! Ative sua conta para continuar')
        .html(
          `<h3>Seja bem-vindo a Sirus!</h3><p>Para ativar a sua conta clique no link abaixo. Caso não foi você que fez o cadastro, basta ignorar esse e-mail.</p><br /><a href="http://localhost/active/${token}">http://localhost/active/${token}</a>`
        )
    })

    return {
      message: 'Sua conta foi criada! Enviamos uma e-mail para você ativa-lá',
    }
  }

  public async authenticate({ request, response }: HttpContextContract) {
    await request.validate(AuthenticatorUserValidator)
    const body = request.body()

    const user = await User.findBy('email', body.email)
    if (!user)
      return response.status(404).json({
        code: 404,
        message: 'Esse e-mail não foi cadastrado no nosso sistema',
      })

    if (!user.active)
      return response.status(403).json({
        code: 403,
        message: 'Sua conta não foi ativada ainda',
      })

    console.log(await Hash.verify(user.password, body.password))
    if (!(await Hash.verify(user.password, body.password)))
      return response.status(400).json({
        code: 400,
        message: 'Sua senha está incorreta',
      })

    const token = jwt.sign({ user }, Env.get('JWT_SECRET'))
    return { token }
  }

  public async activeAccount({ request, response }: HttpContextContract) {
    const { token } = request.params()

    const active = await UserActive.findBy('token', token)
    if (!active)
      return response.status(404).json({
        code: 404,
        message: 'Não encontramos sua conta apartir do seu token',
      })

    const user = await User.findBy('id', active.user_id)
    if (!user)
      return response.status(404).json({
        code: 404,
        message: 'Não encontramos seu usuário.',
      })

    user.active = true
    await user.save()

    active.delete()

    const jwtToken = jwt.sign({ user }, Env.get('JWT_SECRET'))
    return { token: jwtToken }
  }
}
