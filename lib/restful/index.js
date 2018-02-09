modules = require('../import')(__dirname, [
  'market',
  'trading',
  'wallet',
])

class API {
  constructor(client) {
    Object.entries(modules).forEach(([ k1, m ]) => {
      this[k1] = {}
      Object.entries(m).forEach(([ k2, fn ]) => {
        this[k1][k2] = fn.bind(client)
      })
    })
  }
}

module.exports = API
