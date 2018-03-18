const Websocket = require('ws')
const EventEmitter = require('events');
const keys = require('./keys')

const cobinhoodURL = 'wss://feed.cobinhood.com/ws'
const cobinhoodOrigin = 'https://cobinhood.com'

class Socket extends EventEmitter {
  constructor(client) {
    super()
    this.subscribePromise = {}
    this.unsubscribePromise = {}
    this.pingPromise = []
    this.pingInterval = null
    this.ping = this.ping.bind(this)
    this.ws = new Websocket(cobinhoodURL, {
      headers: {
        Origin: cobinhoodOrigin,
        Authorization: client.key,
        Nonce: new Date().valueOf(),
      }
    })
    this.ws.on('message', (msg) => {
      msg = JSON.parse(msg)
      switch (msg.event) {
        case 'error': {
          if (msg.channel_id) {
            if (this.unsubscribePromise[msg.channel_id]) {
              this.unsubscribePromise[msg.channel_id].forEach((cb) => cb.reject(msg))
              this.unsubscribePromise[msg.channel_id] = null
            }
          } else {
            let key = keys.getSubscribeKey(msg)
            if (this.subscribePromise[key]) {
              this.subscribePromise[key].forEach((cb) => cb.reject(msg))
              this.subscribePromise[key] = null
            }
          }
        } break
        case 'subscribed': {
          let key = keys.getSubscribeKey(msg)
          if (this.subscribePromise[key]) {
            this.subscribePromise[key].forEach((cb) => cb.resolve(msg))
            this.subscribePromise[key] = null
          }
        } break
        case 'unsubscribed': {
          if (this.unsubscribePromise[msg.channel_id]) {
            this.unsubscribePromise[msg.channel_id].forEach((cb) => cb.resolve(msg))
            this.unsubscribePromise[msg.channel_id] = null
          }
        } break
        case 'pong': {
          this.pingPromise.forEach((cb) => cb.resolve(msg))
          this.pingPromise = []
        } break
        default: {
          let key = keys.getPreprocessKey(msg.channel_id.split('.')[0])
          this.emit(key, msg)
        } break
      }
    })
    this.ws.on('open', () => {
      this.startPingPong()
    })
    this.ws.on('close', () => {
      this.stopPingPong()
    })
  }
  startPingPong() {
    this.pingTimeout = setInterval(this.ping, 60 * 1000)
  }
  stopPingPong() {
    clearTimeout(this.pingInterval)
    this.pingInterval = null
  }
  subscribe(opts) {
    let key = keys.getSubscribeKey(opts)
    this.subscribePromise[key] = this.subscribePromise[key] || []
    return new Promise((resolve, reject) => {
      this.subscribePromise[key].push({ resolve: resolve, reject: reject })
      this.ws.send(JSON.stringify(Object.assign({
        action: 'subscribe',
      }, opts)))
    })
  }
  unsubscribe(channel) {
    this.unsubscribePromise[channel] = this.unsubscribePromise[channel] || []
    return new Promise((resolve, reject) => {
      this.unsubscribePromise[channel].push({ resolve: resolve, reject: reject })
      this.ws.send(JSON.stringify({
        action: 'unsubscribe',
        channel_id: channel
      }))
    })
  }
  ping() {
    return new Promise((resolve, reject) => {
      this.pingPromise.push({ resolve: resolve, reject: reject })
      this.ws.send(JSON.stringify({
        action: 'ping'
      }))
    })
  }
  close() {
    this.ws.close()
  }
}

module.exports = Socket
