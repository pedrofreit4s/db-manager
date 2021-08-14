import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken'
import DatabaseUser from 'App/Models/DatabaseUser'
import Database from '@ioc:Adonis/Lucid/Database'
import DatabaseModel from 'App/Models/Database'
import crypto from 'crypto'

export default class DatabasesController {
  public async store({ request, response }: HttpContextContract) {
    const { authorization } = request.headers()
    const { name, userId } = request.body()

    if (!name || !userId)
      return response.conflict({
        code: 401,
        message: 'Informe todos os campos!',
      })

    if (!authorization)
      return response.unauthorized({
        code: 401,
        message: 'Invalid bearer token',
      })
    const decrypt: any = jwt.verify(
      authorization.split(' ')[1],
      Env.get('JWT_SECRET')
    )

    const dbUser = await DatabaseUser.findBy('id', userId)
    if (!dbUser)
      return response.notFound({
        code: 404,
        message: 'Não encontramos esse usuário',
      })
    if (await DatabaseModel.findBy('name', name))
      return response.conflict({
        code: 401,
        message: 'Já existe um banco de dados com esse nome',
      })

    const tt = await DatabaseModel.query()
      .where('user_id', decrypt.user.id)
      .count('id')

    if (Number(tt[0].$extras['count(`id`)']) >= 3)
      return response.conflict({
        message: 'Você só pode criar até três databases',
      })
    const db = await DatabaseModel.create({
      name,
      user_db_id: userId,
      user_id: decrypt.user.id,
    })

    try {
      await Database.rawQuery(`CREATE DATABASE ${name};`)
      await Database.rawQuery(
        `GRANT ALL PRIVILEGES ON ${name}.* TO '${dbUser.username}'@'%' WITH GRANT OPTION; `
      )
      await Database.rawQuery(`FLUSH PRIVILEGES;`)

      return response.created(db)
    } catch (error) {
      console.log(error)
    }
  }
  public async list({ request, response }: HttpContextContract) {
    const { authorization } = request.headers()

    if (!authorization)
      return response.unauthorized({
        code: 401,
        message: 'Invalid bearer token',
      })
    const decrypt: any = jwt.verify(
      authorization.split(' ')[1],
      Env.get('JWT_SECRET')
    )

    const databases = await Database.from('database_users as a').innerJoin(
      'databases as b',
      'a.id',
      'b.user_db_id'
    )

    return databases
  }

  public async listUsers({ request, response }: HttpContextContract) {
    const { authorization } = request.headers()

    if (!authorization)
      return response.unauthorized({
        code: 401,
        message: 'Invalid bearer token',
      })
    const decrypt: any = jwt.verify(
      authorization.split(' ')[1],
      Env.get('JWT_SECRET')
    )

    const users = await Database.query()
      .from('database_users')
      .where('user_id', decrypt.user.id)
      .select('*')

    return users
  }
  public async createUser({ request, response }: HttpContextContract) {
    const { authorization } = request.headers()

    if (!authorization)
      return response.unauthorized({
        code: 401,
        message: 'Invalid bearer token',
      })
    const decrypt: any = jwt.verify(
      authorization.split(' ')[1],
      Env.get('JWT_SECRET')
    )

    const tt = await DatabaseUser.query()
      .where('user_id', decrypt.user.id)
      .count('id')

    if (Number(tt[0].$extras['count(`id`)']) >= 3)
      return response.conflict({
        message: 'Você só pode criar até três usuários',
      })
    const username = `${crypto.randomBytes(2).toString('hex')}_${crypto
      .randomBytes(4)
      .toString('hex')}`
    const password = crypto.randomBytes(8).toString('hex')
    const userDatabase = await DatabaseUser.create({
      username,
      password,
      user_id: decrypt.user.id,
    })

    await Database.rawQuery(
      `CREATE USER '${username}'@'%' IDENTIFIED BY '${password}';`
    )

    return response.created(userDatabase)
  }
  public async deleteUser({ request, response }: HttpContextContract) {
    const { authorization } = request.headers()
    const { id } = request.params()

    if (!authorization)
      return response.unauthorized({
        code: 401,
        message: 'Invalid bearer token',
      })
    const decrypt: any = jwt.verify(
      authorization.split(' ')[1],
      Env.get('JWT_SECRET')
    )

    const DBUser = await DatabaseUser.findBy('id', id)
    if (!DBUser)
      return response.notFound({
        code: 404,
        message: 'Não encontramos esse usuário cadastrado',
      })

    if (DBUser.user_id !== decrypt.user.id)
      return response.forbidden({
        code: 401,
        message: 'Você não tem permissão pra fazer isso',
      })

    await Database.rawQuery(
      `delete from mysql.user where User = "${DBUser.username}";`
    )
    await DBUser.delete()

    return response.ok({ code: 200, message: 'Usuário apagado com sucesso' })
  }
}
