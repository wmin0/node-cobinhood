const Client = require('../')
let client = new Client()
client.on('open', () => {
  console.error('open')
  client.subscribePublicTrade('ETH-BTC', (msg) => console.log('on msg', msg))
  .then(() => {
    console.error('subscribe')
  })
  .catch((err) => {
    console.error(err)
    client.close()
  })
})
