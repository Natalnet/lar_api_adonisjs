'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AclIsDevice {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, request, response }, next, ...args) {
    let expression = args[0];
    if (Array.isArray(expression)) {
      expression = expression[0];
    }

    const device = await auth.user
      .deviceJoins()
      .where('device_id', request.device.id)
      .first();

    const is = await device.is(expression);

    if (!is) {
      return response.status(403).send({
        error: { message: 'Você não tem permissão para acessar esta rota!' }
      });
    }

    await next();
  }
}

module.exports = AclIsDevice;
