'use strict';

const Schema = use('Schema');

class PermissionsTableSchema extends Schema {
  up() {
    this.create('permissions', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(this.db.raw('uuid_generate_v4()'));
      table
        .string('slug')
        .notNullable()
        .unique();
      table
        .string('name')
        .notNullable()
        .unique();
      table.text('description').nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('permissions');
  }
}

module.exports = PermissionsTableSchema;
