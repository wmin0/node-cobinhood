const key = `your key here`

const Client = require('../')
let client = new Client({ key: key })
client.on('open', () => {
  console.error('open')
  client.subscribeOrderbook('ETH-BTC', '1E-7', (msg) => console.log('on msg', msg))
  .then(() => {
    console.error('subscribe')
  })
  .catch((err) => {
    console.error(err)
    client.close()
  })
})
