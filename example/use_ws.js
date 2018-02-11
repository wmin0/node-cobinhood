const key = `your key here`

const Client = require('../')
let client = new Client(key)
client.on('open', () => {
  console.error('open')
  client.subscribeOrderbook('COB-ETH', '1E-7', (msg) => console.log)
  .then(() => {
    console.error('subscribe')
  })
  .catch((err) => {
    console.error(err)
    client.close()
  })
})
