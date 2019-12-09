'use strict';

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
    const devices = await auth.user
      .devices()
      .with('users')
      .fetch();
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

    const device = await auth.user
      .devices()
      .create({ ...data, user_id: auth.user.id });

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
  async show({ params, auth }) {
    const device = await auth.user
      .devices()
      .where('devices.id', params.id)
      .with('users')
      .first();

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
  async update({ params, request, auth }) {
    const data = request.all();

    const device = await auth.user
      .devices()
      .where('devices.id', params.id)
      .first();

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
  async destroy({ params, auth }) {
    const device = await auth.user
      .devices()
      .where('devices.id', params.id)
      .first();

    await device.delete();
  }
}

module.exports = DeviceController;
