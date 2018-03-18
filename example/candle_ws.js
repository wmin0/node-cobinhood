const key = `your key here`

const Client = require('../')
let client = new Client({ key: key })
client.on('open', () => {
  console.error('open')
  client.subscribeCandle('ETH-BTC', '1m', (msg) => console.log('on msg', msg))
  .then(() => {
    console.error('subscribe')
  })
  .catch((err) => {
    console.error(err)
    client.close()
  })
})
