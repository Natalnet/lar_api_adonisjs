'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const DeviceUser = use('App/Models/DeviceUser');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use('Adonis/Acl/Role');

class MemberController {
  async store({ request, auth }) {
    const email = request.input('email');

    const user = await User.findByOrFail('email', email);

    await user.devices().attach(auth.user.currentDevice);
    const devicejoin = await user
      .deviceJoins()
      .where('device_id', auth.user.currentDevice)
      .first();

    const userRole = await Role.findBy('slug', 'user');

    await devicejoin.roles().attach(userRole.id);

    return user;
  }

  async update({ request, response, params, auth }) {
    const roles = request.input('roles');

    const admin = await Role.findBy('slug', 'admin');
    const containAdminRole = roles.find(role => role === admin.id);

    if (containAdminRole) {
      return response.status(403).send({
        error: { message: 'Você não tem permissão para acessar esta rota!' }
      });
    }

    const user = await User.find(params.id);

    const devicejoin = await user
      .deviceJoins()
      .where('device_id', auth.user.currentDevice)
      .first();

    await devicejoin.roles().sync(roles);
  }

  async show({ request }) {
    const members = await DeviceUser.query()
      .where('device_id', request.device.id)
      .with('user', builder =>
        builder.select(['id', 'username', 'email', 'avatar_id'])
      )
      .with('roles', builder => builder.select(['id', 'slug']))
      .fetch();

    return members;
  }

  async delete({ params, auth }) {
    const user = await User.find(params.id);

    await user
      .deviceJoins()
      .where('device_id', auth.user.currentDevice)
      .delete();
  }
}

module.exports = MemberController;
