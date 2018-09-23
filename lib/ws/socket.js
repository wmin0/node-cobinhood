const Websocket = require('ws')
const EventEmitter = require('events');
const keys = require('./keys')
const debug = require('debug')('node-cobinhood:ws')

const { formatOrder } = require('./order')

const cobinhoodURL = 'wss://ws.cobinhood.com/v2/ws'
const cobinhoodOrigin = 'https://cobinhood.com'

const formatMsg = (msg) => {
  let obj = {
    channel: msg.h[0],
    version: msg.h[1],
    type: msg.h[2],
    data: msg.d,
  }
  // error should be handle first.
  if (obj.type === 'error') {
    obj = Object.assign({
      code: msg.h[3],
      desc: msg.h[4],
      id: msg.h[5],
    }, obj)
  } else if (obj.channel === 'order') {
    obj = Object.assign({
      code: msg.h[3],
      id: msg.h[4],
    }, obj)
  } else {
    obj = Object.assign({
      id: msg.h[3],
    }, obj)
  }
  return obj
}

const idGenerator = (() => {
  let id = 0;
  return {
    next: () => ('' + (++id))
  }
})()

class Socket extends EventEmitter {
  constructor(client) {
    super()
    this.key = client.key
    this.subscribeChannels = {}
    this.promises = {}
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
        Authorization: this.key || '',
        Nonce: new Date().valueOf(),
      }
    })
    this.ws.on('message', this.onWSMessage)
    this.ws.on('open', this.onWSOpen)
    this.ws.on('error', this.onWSError)
    this.ws.on('close', this.onWSClose)
  }
  onWSMessage(msg) {
    debug(`recv: ${JSON.stringify(msg, 2, 2)}`)
    msg = formatMsg(JSON.parse(msg))
    do {
      if (!msg.id) {
        break
      }
      let cb = this.promises[msg.id]
      delete(this.promises[msg.id])
      if (!cb) {
        break
      }
      // error should be handle first.
      if (msg.type === 'error') {
        cb.reject(msg)
      } else if (msg.channel === 'order') {
        cb.resolve(formatOrder(msg.code, msg.data))
      } else {
        cb.resolve(msg)
      }
    } while(0)

    let key = keys.getPreprocessKey(msg.channel.split('.')[0])
    this.emit(key, msg)
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
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = setTimeout(this.connect, 1000)
    }
  }
  onWSClose() {
    debug(`socket close`)
    debug(`socket reconnect: ${this.reconnect}`)
    this.stopPingPong()
    this.ws.removeAllListeners()
    this.ws = null
    Object.values(this.promises).forEach((cb) => cb.reject())
    this.promises = {}
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
    this.pingInterval = setInterval(this.ping, 60 * 1000)
  }
  stopPingPong() {
    clearInterval(this.pingInterval)
    this.pingInterval = null
  }
  send(msg) {
    debug(`send: ${JSON.stringify(msg, 2, 2)}`)
    this.ws.send(JSON.stringify(msg))
  }
  subscribe(opts) {
    return new Promise((resolve, reject) => {
      let id = idGenerator.next()
      this.promises[id] = {
        resolve: (resp) => {
          this.subscribeChannels[resp.channel] = opts
          resolve(resp)
        },
        reject: reject,
      }
      this.send(Object.assign({
        action: 'subscribe',
        id: id,
      }, opts))
    })
  }
  unsubscribe(channel) {
    return new Promise((resolve, reject) => {
      let id = idGenerator.next()
      this.promises[id] = {
        resolve: (resp) => {
          delete this.subscribeChannels[channel]
          resolve(resp)
        },
        reject: reject,
      }
      this.send({
        action: 'unsubscribe',
        channel_id: channel,
        id: id,
      })
    })
  }
  ping() {
    return new Promise((resolve, reject) => {
      let id = idGenerator.next()
      this.promises[id] = { resolve: resolve, reject: reject }
      this.send({
        action: 'ping',
        id: id,
      })
    })
  }
  placeOrder(pair, type, side, price, size, stopPrice = '', source = 'exchange') {
    return new Promise((resolve, reject) => {
      let id = idGenerator.next()
      this.promises[id] = { resolve: resolve, reject: reject }
      this.send({
        action: 'place_order',
        trading_pair_id: pair,
        type: type,
        side: side,
        price: price.toString(),
        size: size.toString(),
        stopPrice: stopPrice.toString(),
        source: source,
        id: id,
      })
    })
  }
  modifyOrder(orderID, price, size) {
    return new Promise((resolve, reject) => {
      let id = idGenerator.next()
      this.promises[id] = { resolve: resolve, reject: reject }
      this.send({
        action: 'modify_order',
        order_id: orderID,
        price: price.toString(),
        size: size.toString(),
        id: id,
      })
    })
  }
  cancelOrder(orderID) {
    return new Promise((resolve, reject) => {
      let id = idGenerator.next()
      this.promises[id] = { resolve: resolve, reject: reject }
      this.send({
        action: 'cancel_order',
        order_id: orderID,
        id: id,
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
