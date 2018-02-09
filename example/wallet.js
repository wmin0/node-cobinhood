const key = `your key here`

const Client = require('../')
let client = new Client(key)
client.getBalance(key)
.then(console.log, console.error)
.then(() => client.close())
