const key = `your key here`

const Client = require('../')
let client = new Client({ key: key })
client.listOrders()
.then(console.log, console.error)
.then(() => client.placeLimitOrder('COB-ETH', 'ask', '1000', '1000'))
.then(console.log, console.error)
.then(() => client.close())
