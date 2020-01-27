'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class AccountController {
  async index({ response, auth }) {
    try {
      const user = await User.query()
        .where('id', auth.user.id)
        .with('permissions')
        .with('roles')
        .first()

      const userJSON = user.toJSON()

      userJSON.roles = userJSON.roles.map(role => role.slug)
      userJSON.permissions = userJSON.permissions.map(
        permission => permission.slug
      )

      return userJSON
    } catch (err) {
      return response.status(500).send({
        error: { message: 'Sessão expirada, error: ' + err }
      })
    }
  }
}

module.exports = AccountController
