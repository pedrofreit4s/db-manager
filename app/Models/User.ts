import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public active: boolean

  @column.dateTime({
    autoCreate: true,
    columnName: 'createdAt',
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: 'updatedAt',
  })
  public updatedAt: DateTime

  @beforeSave()
  public static async hasPassword(user: User) {
    if (user.$dirty.password)
      user.password = await Hash.make(user.password)
  }
}
