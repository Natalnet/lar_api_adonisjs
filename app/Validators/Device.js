'use strict'

const Antl = use('Antl')

class Device {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'required',
      description: 'required',
      topicToRead: 'required',
      topicToWrite: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Device
