'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DeviceSchema extends Schema {
  async up () {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    this.create('devices', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(this.db.raw('uuid_generate_v4()'))
      table.text('name').notNullable()
      table
        .string('slug')
        .notNullable()
        .unique()
      table
        .string('topicToWrite')
        .notNullable()
        .unique()
      table
        .string('topicToRead')
        .notNullable()
        .unique()
      table.string('description').nullable()
      table.string('status').nullable()
      table
        .boolean('enabled')
        .notNullable()
        .defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('devices')
  }
}

module.exports = DeviceSchema
