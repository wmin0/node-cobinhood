modules = require('../import')(__dirname, [
  'market',
  'trading',
  'wallet',
])

class API {
  constructor(client) {
    this.key = client.key
  }
}

Object.values(modules).forEach((m) => {
  Object.entries(m).forEach(([ key, fn ]) => {
    API.prototype[key] = fn
  })
})

API.prototype.send = require('./send')

module.exports = API
