'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DeviceSchema extends Schema {
  up() {
    this.create('devices', table => {
      table.increments();
      table.text('name').notNullable();
      table
        .string('slug')
        .notNullable()
        .unique();
      table
        .string('topicToWrite')
        .notNullable()
        .unique();
      table
        .string('topicToRead')
        .notNullable()
        .unique();
      table.string('description').nullable();
      table.string('status').nullable();
      table
        .boolean('enabled')
        .notNullable()
        .defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('devices');
  }
}

module.exports = DeviceSchema;
