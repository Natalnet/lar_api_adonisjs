'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Device extends Model {
  owner() {
    return this.belongsTo('App/Models/User');
  }

  members() {
    return this.belongsToMany('App/Models/User').pivotModel(
      'App/Models/UserDevice'
    );
  }
}

module.exports = Device;
