const key = `your key here`

const Client = require('../')
let client = new Client(key)
client.on('open', () => {
  client.subscribeTrade('COB-ETH')
  .then((msg) => {
    console.log('got subscribe', msg)
    client.on(msg.channel_id, console.log)
  })
  .catch((err) => {
    console.error(err)
    client.close()
  })
})
