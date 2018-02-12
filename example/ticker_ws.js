const key = `your key here`

const Client = require('../')
let client = new Client(key)
client.on('open', () => {
  console.error('open')
  client.subscribeTicker('ETH-BTC', (msg) => console.log('on msg', msg))
  .then(() => {
    console.error('subscribe')
  })
  .catch((err) => {
    console.error(err)
    client.close()
  })
})
