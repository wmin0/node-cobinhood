const Websocket = require('ws')

const cobinhoodURL = 'wss://feed.cobinhood.com/ws'
const cobinhoodOrigin = 'https://cobinhood.com'

const getSubscribeKey =
  ({ type, trading_pair_id, precision, timeframe }) =>
  `${type}${trading_pair_id}${precision}${timeframe}`

class WS {
  constructor(client) {
    this.subscribePromise = {}
    this.unsubscribePromise = {}
    this.pingPromise = []
    this.channels = {}
    this.sock = new Websocket(cobinhoodURL, {
      headers: {
        Origin: cobinhoodOrigin,
        Authorization: client.key,
        Nonce: new Date().valueOf(),
      }
    })
    this.sock.on('message', (msg) => {
      msg = JSON.parse(msg)
      switch (msg.event) {
        case 'error':
          if (msg.channel_id) {
            if (this.unsubscribePromise[msg.channel_id]) {
              this.unsubscribePromise[msg.channel_id].forEach((cb) => cb.reject(msg))
              this.unsubscribePromise[msg.channel_id] = null
            }
          } else {
            let key = getSubscribeKey(msg)
            if (this.subscribePromise[key]) {
              this.subscribePromise[key].forEach((cb) => cb.reject(msg))
              this.subscribePromise[key] = null
            }
          }
          break
        case 'subscribed':
          let key = getSubscribeKey(msg)
          if (this.subscribePromise[key]) {
            this.subscribePromise[key].forEach((cb) => cb.resolve(msg))
            this.subscribePromise[key] = null
          }
          this.channels[msg.channel_id] = true
          break
        case 'unsubscribed':
          if (this.unsubscribePromise[msg.channel_id]) {
            this.unsubscribePromise[msg.channel_id].forEach((cb) => cb.resolve(msg))
            this.unsubscribePromise[msg.channel_id] = null
          }
          delete this.channels[msg.channel_id]
          break
        case 'pong':
          this.pingPromise.forEach((cb) => cb.resolve(msg))
          this.pingPromise = []
        default:
          client.emit(msg.channel_id, msg)
          break
      }
    })
    this.sock.on('open', () => client.emit('open'))
    this.sock.on('close', () => client.emit('close'))
    this.sock.on('error', (err) => client.emit('error', err))
  }
  close() {
    this.sock.close()
  }
  getChannels() {
    return Object.keys(this.channels)
  }
  subscribe(opts) {
    let key = getSubscribeKey(opts)
    this.subscribePromise[key] = this.subscribePromise[key] || []
    return new Promise((resolve, reject) => {
      this.subscribePromise[key].push({ resolve: resolve, reject: reject })
      this.sock.send(JSON.stringify(Object.assign({
        action: 'subscribe',
      }, opts)))
    })
  }
  unsubscribe(channel) {
    this.unsubscribePromise[channel] = this.unsubscribePromise[channel] || []
    return new Promise((resolve, reject) => {
      this.unsubscribePromise[channel].push({ resolve: resolve, reject: reject })
      this.sock.send(JSON.stringify({
        action: 'unsubscribe',
        channel_id: channel
      }))
    })
  }
  ping() {
    return new Promise((resolve, reject) => {
      this.pingPromise.push({ resolve: resolve, reject: reject })
      this.sock.send(JSON.stringify({
        action: 'ping'
      }))
    })
  }
}

module.exports = WS
