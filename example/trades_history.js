const key = `your key here`

const Client = require('../')
let client = new Client({ key: key })
client.getTradesHistory('ETH-BTC')
.then(console.log, console.error)
.then(() => client.close())
