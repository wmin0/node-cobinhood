const key = `your key here`

const Client = require('../')
let client = new Client({ key: key })
client.on('open', () => {
  console.error('open')
  client.placeLimitOrderWS('COB-ETH', 'bid', '0.0001', '100000', 'exchange')
  .then(console.log, console.error)
})

client.on('error', (msg) => console.error('on error', msg))
