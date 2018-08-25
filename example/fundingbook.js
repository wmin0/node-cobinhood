const key = `your key here`

const Client = require('../')
let client = new Client({ key: key })
client.getFundingbook('USDT', 5, '1E-5')
.then(console.log, console.error)
.then(() => client.close())
