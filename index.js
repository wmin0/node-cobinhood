const EventEmitter = require('events');
const API = require('./lib/restful')
const WS = require('./lib/ws')

class Client extends EventEmitter {
  constructor(key = '') {
    super()
    this.key = key
    this.api = new API(this)
    this.ws = new WS(this)
    this.cache = {}
  }
  listOrders() {
    return this.api.trading.listOrders()
  }
  listTradingPairs() {
    if (this.cache.tradingPairs) {
      return Promise.resolve(this.cache.tradingPairs)
    }
    return (
      this.api.market.listTradingPairs()
      .then((pairs) => this.cache.tradingPairs = pairs)
    )
  }
  placeLimitOrder(pair, side, price, size) {
    return this.api.trading.placeOrder(pair, 'limit', side, price, size)
  }
  placeMarketOrder(pair, side, size) {
    return this.api.trading.placeOrder(pair, 'market', side, '0', size)
  }
  cancelOrder(id) {
    return this.api.trading.cancelOrder(id)
  }
  getOrder(id) {
    return this.api.trading.getOrder(id)
  }
  modifyOrder(id, pair, price, size) {
    return this.api.trading.modifyOrder(id, pair, price, size)
  }
  getBalance() {
    return this.api.wallet.getBalance()
  }
  subscribeOrder() {
    return this.ws.subscribe({
      type: 'order'
    })
  }
  subscribeTicker(pair) {
    return this.ws.subscribe({
      type: 'ticker',
      trading_pair_id: pair
    })
  }
  subscribeTrade(pair) {
    return this.ws.subscribe({
      type: 'trade',
      trading_pair_id: pair
    })
  }
  subscribeOrderbook(pair, precision) {
    return this.ws.subscribe({
      type: 'order-book',
      trading_pair_id: pair,
      precision: precision
    })
  }
  subscribeCandle(pair, timeframe) {
    return this.ws.subscribe({
      type: 'candle',
      trading_pair_id: pair,
      timeframe: timeframe,
    })
  }
  unsubscribe(channel) {
    return this.ws.unsubscribe(channel)
  }
  close() {
    this.ws.close()
  }
}

module.exports = Client
