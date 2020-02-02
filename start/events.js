const Event = use('Event')
const Mqtt = use('Mqtt')

// Listen to some Events of the library
Event.on('MQTT:Connected', async () => {
  console.log('MQTT Connected')
})

Event.on('MQTT:Disconnected', async () => {
  console.log('MQTT Disconnected')
})
