const key = `your key here`

const Client = require('../')
let client = new Client({ key: key })

let end = new Date()
let start = new Date(end.valueOf() - 3600000)

client.getCandles('COB-ETH', start, end, '1m')
.then(console.log, console.error)
.then(() => client.close())
