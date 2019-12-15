'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth/src/Schemes/Jwt')} AuthJwt */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use('Role');
class UserController {
  /**
   * Show a list of all users.
   * GET users
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async index({ request }) {
    const { page, limit } = request.headers(['page', 'limit']);

    const users = await User.query()
      .with('roles', builder => builder.select('id', 'slug', 'name'))
      .with('deviceJoins', builder => {
        builder.with('roles', builder => builder.select('id', 'slug', 'name'));
        builder.with('device');
      })
      .with('permissions')
      .paginate(page || 1, limit || 6);

    return users;
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
    const data = request.only(['username', 'email']);

    const user = await User.create(data);
    const visitor = await Role.findBy('slug', 'visitor');
    await user.roles().attach(visitor.id);

    const token = await auth.generate(user);

    return response.json({ user, token });
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
      const user = await User.findOrFail(params.id);

      await user.loadMany(['roles', 'permissions']);

      return user;
    } catch (err) {
      return response.status(err.status).send({
        error: { message: 'Usuário não encontrado!' }
      });
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
      ]);

      const user = await User.findOrFail(params.id);

      user.merge(data);

      await user.save();

      if (roles) {
        await user.roles().sync(roles);
      }

      if (permissions) {
        await user.permissions().sync(permissions);
      }

      await user.loadMany(['roles', 'permissions']);

      return user;
    } catch (err) {
      return response.status(err.status).send({
        error: { message: 'Usuário não encontrado!' }
      });
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
      const user = await User.findOrFail(params.id);

      await user.delete();
    } catch (err) {
      return response.status(err.status).send({
        error: { message: 'Usuário não encontrado!' }
      });
    }
  }
}

module.exports = UserController;
