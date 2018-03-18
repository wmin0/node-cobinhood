const Socket = require('./socket')
const utils = require('../utils')
const keys = require('./keys')

modules = require('../import')(__dirname, [
  'ticker',
  'candle',
  'orderbook',
  'order',
  'trade',
])

class WS {
  constructor(client) {
    this.key = client.key
    this.socket = new Socket(this)
    this.socket.on('open', () => client.emit('open'))
    this.socket.on('close', () => client.emit('close'))
    this.socket.on('error', (err) => client.emit('error', err))
  }
  close() {
    this.socket.close()
  }
}

Object.entries(modules).forEach(([ key, m ]) => {
  let type = key
  if (type === 'orderbook') {
    type = 'order-book'
  }
  key = key.replace(/^\w/, (c) => c.toUpperCase())
  WS.prototype[`subscribe${key}`] = function(opts, fn) {
    opts = Object.assign({ type: type }, opts)
    let channelKey = m.getChannelKey(opts)
    let preprocessKey = keys.getPreprocessKey(type)
    let promise = Promise.resolve()
    if (this.socket.listenerCount(preprocessKey) === 0) {
      this.socket.on(preprocessKey, m.preprocess.bind(this))
    }
    if (this.socket.listenerCount(channelKey) === 0) {
      promise = this.socket.subscribe(opts)
    }
    this.socket.on(channelKey, fn)
    return (
      promise
      .catch((err) => {
        this.socket.removeListener(channelKey, fn)
        throw err
      })
    )
  }
  WS.prototype[`unsubscribe${key}`] = function(opts, fn) {
    let channelKey = m.getChannelKey(opts)
    let promise = Promise.resolve()
    this.socket.removeListener(channelKey, fn)
    if (this.socket.listenerCount(channelKey) === 0) {
      promise = this.socket.unsubscribe(channelKey)
    }
    return promise
  }
})

module.exports = WS
