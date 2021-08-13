import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DatabaseUsers extends BaseSchema {
  protected tableName = 'database_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('username').unique()
      table.string('password')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
