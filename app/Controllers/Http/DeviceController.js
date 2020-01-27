'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use('Adonis/Acl/Role')

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
    const devices = await auth.user.devices().fetch()

    const devicesJSON = devices.toJSON()

    devicesJSON.map(device => delete device.pivot)

    return devicesJSON
  }

  /**
   * Create/save a new device.
   * POST devices
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ response, request, auth }) {
    const data = request.only([
      'name',
      'description',
      'topicToRead',
      'topicToWrite',
      'enabled',
      'status'
    ])
    try {
      const device = await auth.user.devices().create(data)

      const deviceJoin = await auth.user
        .deviceJoins()
        .where('device_id', device.id)
        .first()

      const adminDevice = await Role.findBy('slug', 'admin_device')

      await deviceJoin.roles().attach([adminDevice.id])

      await device.load('user')

      return device
    } catch (err) {
      return response.status(400).send({
        error: { message: 'Já existe um dispositivo com esse nome!' }
      })
    }
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
  async show({ response, auth, params }) {
    try {
      const device = await auth.user
        .devices()
        .where('device_id', params.id)
        .first()

      if (!device) {
        return response.status(404).send({
          error: { message: 'Dispositivo não encontrado!' }
        })
      }

      return device
    } catch (err) {
      return response.status(404).send({
        error: { message: 'Dispositivo não encontrado!' }
      })
    }
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
    const data = request.all()

    const device = await request.device

    device.merge(data)

    await device.save()

    return device
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
    await request.device.delete()
  }
}

module.exports = DeviceController
