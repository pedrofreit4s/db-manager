import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class DatabaseUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public password: string

  @column()
  public user_id: number

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
}
