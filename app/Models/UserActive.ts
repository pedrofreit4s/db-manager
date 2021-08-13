import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserActive extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public token: string

  @column({ columnName: 'expiresIn' })
  public expiresIn: Date

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true, columnName: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: 'updatedAt',
  })
  public updatedAt: DateTime
}
