'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const DeviceUser = use('App/Models/DeviceUser')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use('Adonis/Acl/Role')

class MemberController {
  async index({ auth }) {
    const members = await DeviceUser.query()
      .where('device_id', auth.user.currentDevice)
      .with('user', builder =>
        builder.select(['id', 'username', 'email', 'avatar_id'])
      )
      .with('roles', builder => builder.select(['id', 'slug']))
      .fetch()

    return members
  }

  async store({ response, request, auth }) {
    const email = request.input('email')
    try {
      const user = await User.findByOrFail('email', email)

      const isMember = await user
        .deviceJoins()
        .where('device_id', auth.user.currentDevice)
        .first()

      if (isMember) {
        return response.status(400).send({
          error: { message: 'O usuário já é membro desse dispositivo!' }
        })
      }

      await user.devices().attach(auth.user.currentDevice)

      const userDeviceRole = await Role.findBy('slug', 'user_device')

      const deviceJoin = await user
        .deviceJoins()
        .where('device_id', auth.user.currentDevice)
        .first()

      await deviceJoin.roles().attach(userDeviceRole.id)

      return user
    } catch (err) {
      return response.status(err.status || 404).send({
        error: { message: 'Usuário não encontrado!' }
      })
    }
  }

  async update({ request, response, params, auth }) {
    const roles = request.input('roles')

    const admin = await Role.findBy('slug', 'admin')
    const containAdminRole = roles.find(role => role === admin.id)

    if (containAdminRole) {
      return response.status(403).send({
        error: { message: 'Você não tem permissão para fazer isso!' }
      })
    }

    const user = await User.find(params.id)

    if (!user) {
      return response.status(404).send({
        error: { message: 'Usuário não encontrado!' }
      })
    }

    const devicejoin = await user
      .deviceJoins()
      .where('device_id', auth.user.currentDevice)
      .first()

    if (!devicejoin) {
      return response.status(404).send({
        error: { message: 'O usuário não é membro desse dispositivo!' }
      })
    }

    await devicejoin.roles().sync(roles)
  }

  async delete({ response, params, auth }) {
    const user = await User.find(params.id)

    if (!user) {
      return response.status(404).send({
        error: { message: 'Usuário não encontrado!' }
      })
    }

    await user
      .deviceJoins()
      .where('device_id', auth.user.currentDevice)
      .delete()
  }
}

module.exports = MemberController
