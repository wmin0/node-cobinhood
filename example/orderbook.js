const key = `your key here`

const Client = require('../')
let client = new Client({ key: key })
client.getOrderbook('COB-ETH', 5, '1E-5')
.then(console.log, console.error)
.then(() => client.getOrderbook('COB-ETH'))
.then(console.log, console.error)
.then(() => client.listTrades('COB-ETH'))
.then(console.log, console.error)
.then(() => client.close())
