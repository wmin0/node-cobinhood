const EventEmitter = require('events');
const API = require('./lib/restful')
const WS = require('./lib/ws')
const Decimal = require('decimal.js')

class Client extends EventEmitter {
  constructor(key = '') {
    super()
    this.key = key
    this.api = new API(this)
    this.ws = new WS(this)
    this.cache = {}
  }
  listOrders() {
    return this.api.listOrders()
  }
  listTradingPairs() {
    if (this.cache.tradingPairs) {
      return Promise.resolve(this.cache.tradingPairs)
    }
    return (
      this.api.listTradingPairs()
      .then((pairs) => this.cache.tradingPairs = pairs)
    )
  }
  placeLimitOrder(pair, side, price, size) {
    return this.api.placeLimitOrder(pair, side, price, size)
  }
  placeMarketOrder(pair, side, size) {
    return this.api.placeMarketOrder(pair, side, size)
  }
  cancelOrder(id) {
    return this.api.cancelOrder(id)
  }
  getOrder(id) {
    return this.api.getOrder(id)
  }
  modifyOrder(id, pair, price, size) {
    return this.api.modifyOrder(id, pair, price, size)
  }
  getBalance() {
    return this.api.getBalance()
  }
  subscribeOrder(fn) {
    return this.ws.subscribeOrder({}, fn)
  }
  unsubscribeOrder(fn) {
    return this.ws.unsubscribeOrder({}, fn)
  }
  subscribeTicker(pair, fn) {
    return this.ws.subscribeTicker({
      trading_pair_id: pair
    }, fn)
  }
  unsubscribeTicker(pair, fn) {
    return this.ws.unsubscribeTicker({
      trading_pair_id: pair
    }, fn)
  }
  subscribeTrade(pair, fn) {
    return this.ws.subscribeTrade({
      trading_pair_id: pair
    }, fn)
  }
  unsubscribeTrade(pair, fn) {
    return this.ws.unsubscribeTrade({
      trading_pair_id: pair
    }, fn)
  }
  subscribeOrderbook(pair, precision, fn) {
    if (precision instanceof Decimal) {
      precision = precision.toExponential().toUpperCase()
    }
    return this.ws.subscribeOrderbook({
      trading_pair_id: pair,
      precision: precision
    }, fn)
  }
  unsubscribeOrderbook(pair, precision, fn) {
    if (precision instanceof Decimal) {
      precision = precision.toExponential().toUpperCase()
    }
    return this.ws.unsubscribeOrderbook({
      trading_pair_id: pair,
      precision: precision
    }, fn)
  }
  subscribeCandle(pair, timeframe, fn) {
    return this.ws.subscribeCandle({
      trading_pair_id: pair,
      timeframe: timeframe,
    }, fn)
  }
  unsubscribeCandle(pair, timeframe, fn) {
    return this.ws.unsubscribeCandle({
      trading_pair_id: pair,
      timeframe: timeframe,
    }, fn)
  }
  close() {
    this.ws.close()
  }
}

module.exports = Client
