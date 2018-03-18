const key = `your key here`

const Client = require('../')
let client = new Client({ key: key })
client.listTrades('COB-ETH')
.then(console.log, console.error)
.then(() => client.close())
