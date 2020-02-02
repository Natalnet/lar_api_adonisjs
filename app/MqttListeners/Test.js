'use strict'

const MqttListener = use('MqttListener')

class Test extends MqttListener {
  /**
   * This is the subscription string the listener is listening to.
   *
   * @returns {string}
   */
  get subscription() {
    return 'light/esp32/vivo'
  }

  /**
   * Message handler. Do what you want with your MQTT message here.
   *
   * @param {String} message Data of the message
   * @param {String[]} wildcardMatches Wildcard matches in your subscription string
   */
  async handleMessage(message, wildcardMatches) {
    console.log(message)
  }
}

module.exports = Test
