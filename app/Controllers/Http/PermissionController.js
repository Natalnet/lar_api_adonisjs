'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const DeviceUser = use('App/Models/DeviceUser')

class PermissionController {
  async index ({ request, auth }) {
    const deviceJoin = await DeviceUser.query()
      .where('device_id', request.device.id)
      .where('user_id', auth.user.id)
      .first()

    return {
      roles: await deviceJoin.getRoles(),
      permissions: await deviceJoin.getPermissions()
    }
  }
}

module.exports = PermissionController
