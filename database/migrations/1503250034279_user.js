'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments();
      table
        .string('username')
        .notNullable()
        .unique();
      table
        .string('email')
        .notNullable()
        .unique();
      table
        .integer('avatar_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table.string('token');
      table.timestamp('token_created_at');
      table.string('password').notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
