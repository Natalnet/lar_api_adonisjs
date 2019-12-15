'use strict';

const Schema = use('Schema');

class PermissionUserTableSchema extends Schema {
  up() {
    this.create('device_user_permission', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(this.db.raw('uuid_generate_v4()'));
      table
        .uuid('permission_id')
        .unsigned()
        .index();
      table
        .foreign('permission_id')
        .references('id')
        .on('permissions')
        .onDelete('cascade');
      table
        .uuid('device_user_id')
        .unsigned()
        .index();
      table
        .foreign('device_user_id')
        .references('id')
        .on('device_users')
        .onDelete('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('device_user_permission');
  }
}

module.exports = PermissionUserTableSchema;
