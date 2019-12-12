'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use('Adonis/Acl/Role');

/**
 * Resourceful controller for interacting with devices
 */
class DeviceController {
  /**
   * Show a list of all devices.
   * GET devices
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth }) {
    const devices = await auth.user.devices().fetch();
    return devices;
  }

  /**
   * Create/save a new device.
   * POST devices
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, auth }) {
    const data = request.only([
      'name',
      'description',
      'topicToRead',
      'topicToWrite',
      'enabled',
      'status'
    ]);

    const device = await auth.user.devices().create(data);

    const deviceJoin = await auth.user
      .deviceJoins()
      .where('device_id', device.id)
      .first();

    const adminDevice = await Role.findBy('slug', 'adminDevice');

    await deviceJoin.roles().attach([adminDevice.id]);

    return device;
  }

  /**
   * Display a single device.
   * GET devices/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ auth, params }) {
    const device = await auth.user
      .devices()
      .where('device_id', params.id)
      .fetch();

    return device;
  }

  /**
   * Update device details.
   * PUT or PATCH devices/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request }) {
    const data = request.all();

    const device = await request.device;

    device.merge(data);

    await device.save();

    return device;
  }

  /**
   * Delete a device with id.
   * DELETE devices/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ request }) {
    await request.device.delete();
  }
}

module.exports = DeviceController;
