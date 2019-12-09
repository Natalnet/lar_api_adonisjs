'use strict';

const Schema = use('Schema');

class RoleUserTableSchema extends Schema {
  up() {
    this.create('role_user', table => {
      table.increments();
      table
        .integer('role_id')
        .unsigned()
        .index();
      table
        .foreign('role_id')
        .references('id')
        .on('roles')
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
    this.drop('role_user');
  }
}

module.exports = RoleUserTableSchema;
