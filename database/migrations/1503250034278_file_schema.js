'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FileSchema extends Schema {
  async up () {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    this.create('files', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(this.db.raw('uuid_generate_v4()'))
      table.string('name').notNullable()
      table.string('path').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('files')
  }
}

module.exports = FileSchema
