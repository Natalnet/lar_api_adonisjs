'use strict'

const Schema = use('Schema')

class RoleUserTableSchema extends Schema {
  up () {
    this.create('device_user_role', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(this.db.raw('uuid_generate_v4()'))
      table
        .uuid('role_id')
        .unsigned()
        .index()
      table
        .foreign('role_id')
        .references('id')
        .on('roles')
        .onDelete('cascade')
      table
        .uuid('device_user_id')
        .unsigned()
        .index()
      table
        .foreign('device_user_id')
        .references('id')
        .on('device_users')
        .onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('device_user_role')
  }
}

module.exports = RoleUserTableSchema
