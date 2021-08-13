import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Databases extends BaseSchema {
  protected tableName = 'databases'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').unique()
      table
        .integer('user_db_id')
        .unsigned()
        .references('database_users.id')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
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
