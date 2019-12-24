'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DeviceUserSchema extends Schema {
  up () {
    this.create('device_users', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(this.db.raw('uuid_generate_v4()'))
      table
        .uuid('user_id')
        .references('id')
        .on('users')
        .onDelete('cascade')
      table
        .uuid('device_id')
        .references('id')
        .on('devices')
        .onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('device_users')
  }
}

module.exports = DeviceUserSchema
