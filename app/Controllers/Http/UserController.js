'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth/src/Schemes/Jwt')} AuthJwt */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use('Role')
class UserController {
  /**
   * Show a list of all users.
   * GET users
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async index({ request }) {
    const { page, limit } = request.headers(['page', 'limit'])

    const users = await User.query()
      .with('roles', builder => builder.select('id', 'slug', 'name'))
      .with('deviceJoins', builder => {
        builder.with('roles', builder => builder.select('id', 'slug', 'name'))
        builder.with('device')
      })
      .with('permissions')
      .paginate(page || 1, limit || 6)

    return users
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {AuthJwt} ctx.auth
   * @param {Request} ctx.request
   */
  async store({ auth, request, response }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)
    const visitor = await Role.findBy('slug', 'visitor')
    await user.roles().attach(visitor.id)

    const token = await auth.generate(user)

    return response.json(token)
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    try {
      const user = await User.findOrFail(params.id)

      await user.loadMany(['roles', 'permissions', 'devices'])

      const userJSON = user.toJSON()

      userJSON.roles = userJSON.roles.map(role => {
        return { id: role.id, slug: role.slug, name: role.name }
      })

      userJSON.permissions = userJSON.permissions.map(permission => {
        return {
          id: permission.id,
          slug: permission.slug,
          name: permission.name
        }
      })

      return userJSON
    } catch (err) {
      return response.status(err.status || 404).send({
        error: { message: 'Usuário não encontrado!' }
      })
    }
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const { permissions, roles, ...data } = request.only([
        'username',
        'email',
        'password',
        'permissions',
        'roles'
      ])

      const user = await User.findOrFail(params.id)
      user.merge(data)

      await user.save()

      if (roles) {
        await user.roles().sync(roles)
      }

      if (permissions) {
        await user.permissions().sync(permissions)
      }

      await user.loadMany(['roles', 'permissions'])

      return user
    } catch (err) {
      return response.status(err.status || 404).send({
        error: { message: 'Usuário não encontrado!' }
      })
    }
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    try {
      const user = await User.findOrFail(params.id)

      await user.delete()
    } catch (err) {
      return response.status(err.status || 404).send({
        error: { message: 'Usuário não encontrado!' }
      })
    }
  }
}

module.exports = UserController
