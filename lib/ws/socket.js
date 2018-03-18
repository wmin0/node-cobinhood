const Websocket = require('ws')
const EventEmitter = require('events');
const keys = require('./keys')
const debug = require('debug')('node-cobinhood:ws')

const cobinhoodURL = 'wss://feed.cobinhood.com/ws'
const cobinhoodOrigin = 'https://cobinhood.com'

class Socket extends EventEmitter {
  constructor(client) {
    super()
    this.key = client.key
    this.subscribeChannels = {}
    this.subscribePromise = {}
    this.unsubscribePromise = {}
    this.pingPromise = []
    this.pingInterval = null
    this.reconnect = true
    this.reconnecting = false
    this.reconnectTimeout = null

    this.subscribe = this.subscribe.bind(this)
    this.ping = this.ping.bind(this)
    this.close = this.close.bind(this)
    this.onWSMessage = this.onWSMessage.bind(this)
    this.onWSOpen = this.onWSOpen.bind(this)
    this.onWSError = this.onWSError.bind(this)
    this.onWSClose = this.onWSClose.bind(this)

    this.connect()
  }
  connect() {
    debug(`socket connecting`)
    this.ws = new Websocket(cobinhoodURL, {
      headers: {
        Origin: cobinhoodOrigin,
        Authorization: this.key,
        Nonce: new Date().valueOf(),
      }
    })
    this.ws.on('message', this.onWSMessage)
    this.ws.on('open', this.onWSOpen)
    this.ws.on('error', this.onWSError)
    this.ws.on('close', this.onWSClose)
  }
  onWSMessage(msg) {
    msg = JSON.parse(msg)
    debug(`recv: ${JSON.stringify(msg, 2, 2)}`)
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
  }
  onWSOpen() {
    debug(`socket connected`)
    this.startPingPong()
    let channels = Object.values(this.subscribeChannels)
    this.subscribeChannels = {}
    channels.forEach(this.subscribe)
    if (this.reconnecting) {
      this.emit('reconnected')
    } else {
      this.emit('open')
    }
    this.reconnecting = false
  }
  onWSError(err) {
    debug(`socket error ${JSON.stringify(err, 2, 2)}`)
    debug(`socket reconnecting: ${this.reconnecting}`)
    this.emit('error', err)
    if (this.reconnecting) {
      this.reconnectTimeout = setTimeout(this.connect, 1000)
    }
  }
  onWSClose() {
    debug(`socket close`)
    debug(`socket reconnect: ${this.reconnect}`)
    this.stopPingPong()
    this.ws.removeAllListeners()
    this.ws = null
    if (this.reconnect) {
      this.reconnecting = true
      this.emit('reconnecting')
      this.connect()
    } else {
      this.reconnecting = false
      this.emit('close')
    }
  }
  startPingPong() {
    this.pingTimeout = setInterval(this.ping, 60 * 1000)
  }
  stopPingPong() {
    clearTimeout(this.pingInterval)
    this.pingInterval = null
  }
  send(msg) {
    debug(`send: ${JSON.stringify(msg, 2, 2)}`)
    this.ws.send(JSON.stringify(msg))
  }
  subscribe(opts) {
    let key = keys.getSubscribeKey(opts)
    this.subscribeChannels[key] = Object.assign({}, opts)
    this.subscribePromise[key] = this.subscribePromise[key] || []
    return new Promise((resolve, reject) => {
      this.subscribePromise[key].push({ resolve: resolve, reject: reject })
      this.send(Object.assign({
        action: 'subscribe',
      }, opts))
    })
  }
  unsubscribe(channel) {
    delete this.subscribeChannels[channel]
    this.unsubscribePromise[channel] = this.unsubscribePromise[channel] || []
    return new Promise((resolve, reject) => {
      this.unsubscribePromise[channel].push({ resolve: resolve, reject: reject })
      this.send({
        action: 'unsubscribe',
        channel_id: channel
      })
    })
  }
  ping() {
    return new Promise((resolve, reject) => {
      this.pingPromise.push({ resolve: resolve, reject: reject })
      this.send({
        action: 'ping'
      })
    })
  }
  close() {
    this.reconnect = false
    clearTimeout(this.reconnectTimeout)
    this.reconnectTimeout = null
    this.ws.close()
  }
}

module.exports = Socket
