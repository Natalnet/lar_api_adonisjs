'use strict';

const Schema = use('Schema');

class PermissionUserTableSchema extends Schema {
  up() {
    this.create('permission_user', table => {
      table.increments();
      table
        .integer('permission_id')
        .unsigned()
        .index();
      table
        .foreign('permission_id')
        .references('id')
        .on('permissions')
        .onDelete('cascade');
      table
        .integer('user_device_id')
        .unsigned()
        .index();
      table
        .foreign('user_device_id')
        .references('id')
        .on('user_devices')
        .onDelete('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('permission_user');
  }
}

module.exports = PermissionUserTableSchema;
