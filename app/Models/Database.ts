import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Database extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public user_db_id: number

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
