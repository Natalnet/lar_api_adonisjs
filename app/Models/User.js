'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

const uuid = require('uuid/v4');

class User extends Model {
  static get hidden() {
    return [
      'password',
      'token',
      'token_created_at',
      'updated_at',
      'created_at'
    ];
  }

  static boot() {
    const user = {
      id: uuid.v4()
    };
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });

    this.addHook('beforeCreate', async userInstance => {
      userInstance.id = user.id;
    });
    this.addHook('afterCreate', async userInstance => {
      userInstance.id = await user.id;
      await delete user.id;
      user.id = await uuid.v4();
    });
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token');
  }

  deviceJoins() {
    return this.hasMany('App/Models/DeviceUser');
  }

  devices() {
    return this.belongsToMany('App/Models/Device').pivotModel(
      'App/Models/DeviceUser'
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
