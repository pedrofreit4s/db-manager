import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserActives extends BaseSchema {
  protected tableName = 'user_actives'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('token')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.timestamp('expiresIn', { useTz: true })
      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
