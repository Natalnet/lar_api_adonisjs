'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

class User extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  static get hidden() {
    return ['password', 'token', 'token_created_at'];
  }

  devicesJoins() {
    return this.hasMany('App/Models/UserDevice');
  }

  tokens() {
    return this.hasMany('App/Models/Token');
  }

  devices() {
    return this.belongsToMany('App/Models/Device').pivotModel(
      'App/Models/UserDevice'
    );
  }

  static get traits() {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ];
  }
}

module.exports = User;
