'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  async up () {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    this.create('users', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(this.db.raw('uuid_generate_v4()'))
      table
        .string('username')
        .notNullable()
        .unique()
      table
        .string('email')
        .notNullable()
        .unique()
      table
        .uuid('avatar_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table.string('token')
      table.timestamp('token_created_at')
      table.string('password').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
