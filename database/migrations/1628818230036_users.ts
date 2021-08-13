import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(
      this.tableName,
      (table) => {
        table
          .increments('id')
          .primary()
          .notNullable()
        table
          .string('name')
          .notNullable()
        table
          .string('email')
          .unique()
          .notNullable()
        table
          .string('password')
          .notNullable()
        table
          .boolean('active')
          .notNullable()
          .defaultTo(false)
        table.timestamp('createdAt', {
          useTz: true,
        })
        table.timestamp('updatedAt', {
          useTz: true,
        })
      }
    )
  }

  public async down() {
    this.schema.dropTable(
      this.tableName
    )
  }
}
