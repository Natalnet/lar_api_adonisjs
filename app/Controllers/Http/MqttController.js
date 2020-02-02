'use strict'

const Mqtt = use('Mqtt')

class MqttController {
  /**
   * publish - publish <message> to <topic>
   *
   * @param {String} topic - topic to publish to
   * @param {(String|Buffer)} message - message to publish
   *
   * @param {Object}    [opts] - publish options, includes:
   *   @param {Number}  [opts.qos] - qos level to publish on
   *   @param {Boolean} [opts.retain] - whether or not to retain the message
   *
   * @returns {Promise} Result of publish
   *
   * @example await Mqtt.sendMessage('test/topic', 'This is a message')
   * @example await Mqtt.sendMessage('test/topic', 'This is a message', {qos: 2})
   */
  async store({ request }) {
    const { message, topicToWrite } = request.only(['message', 'topicToWrite'])
    try {
      await Mqtt.sendMessage(topicToWrite, message)
    } catch (error) {
      return { message: { error: 'Dispositivo não conectado!' } }
    }
  }
}

module.exports = MqttController
