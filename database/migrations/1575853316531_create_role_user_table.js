'use strict';

const Schema = use('Schema');

class RoleUserTableSchema extends Schema {
  up() {
    this.create('role_user', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(this.db.raw('uuid_generate_v4()'));
      table
        .uuid('role_id')
        .unsigned()
        .index();
      table
        .foreign('role_id')
        .references('id')
        .on('roles')
        .onDelete('cascade');
      table
        .uuid('user_id')
        .unsigned()
        .index();
      table
        .foreign('user_id')
        .references('id')
        .on('users')
        .onDelete('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('role_user');
  }
}

module.exports = RoleUserTableSchema;
