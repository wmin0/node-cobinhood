const send = require('./send')
const Decimal = require('decimal.js')

const formatOrder = (order) => ({
  id: order.id,
  tradingPair: order.trading_pair_id,
  side: order.side,
  type: order.type,
  size: new Decimal(order.size),
  price: new Decimal(order.price),
  filled: new Decimal(order.filled),
  state: order.state,
  timestamp: new Date(order.timestamp),
  eqPrice: new Decimal(order.eq_price),
  stopPrice: order.stop_price? new Decimal(order.stop_price): null,
  completedAt: order.completed_at? new Date(order.completed_at): null,
  source: order.source,
})

const formatTrade = (trade) => ({
  id: trade.id,
  tradingPair: trade.trading_pair_id,
  side: trade.maker_side,
  size: new Decimal(trade.size),
  price: new Decimal(trade.price),
  timestamp: new Date(trade.timestamp),
})

const formatPosition = (position) => ({
  id: position.id,
  tradingPair: position.trading_pair_id,
  baseSize: new Decimal(position.base_size),
  quoteSize: new Decimal(position.quote_size),
  eqPrice: new Decimal(position.eq_price),
  interest: new Decimal(position.interest),
  profit: new Decimal(position.profit),
  liqPrice: new Decimal(position.liq_price),
})

const listOrders = function() { return (
  this.send('listOrders')
  .then((result) => {
    result.orders = result.orders.map(formatOrder)
    return result
  })
) }

const placeLimitOrder = function(pair, side, price, size, source) { return (
  this.placeOrder(pair, 'limit', side, price, size, '0', source)
) }

const placeMarketOrder = function(pair, side, size, source) { return (
  this.placeOrder(pair, 'market', side, '0', size, '0', source)
) }

const placeLimitStopOrder = function(pair, side, price, size, stopPrice) { return (
  this.placeOrder(pair, 'limit_stop', side, price, size, stopPrice)
) }

const placeMarketStopOrder = function(pair, side, size, stopPrice) { return (
  this.placeOrder(pair, 'market_stop', side, '0', size, stopPrice)
) }

const placeOrder = function(pair, type, side, price, size, stopPrice = '', source = 'exchange') { return (
  this.send('placeOrder', {
    trading_pair_id: pair,
    type: type,
    side: side,
    price: price.toString(),
    size: size.toString(),
    stop_price: price.toString(),
    source: source,
  })
  .then((result) => formatOrder(result.order))
) }

const cancelOrder = function(id) { return (
 this.send('cancelOrder', { id: id })
) }

const modifyOrder = function(id, pair, price, size) { return (
  this.send('modifyOrder', {
    id: id,
    trading_pair_id: pair,
    price: price.toString(),
    size: size.toString(),
  })
) }

const getOrder = function(id) { return (
  this.send('getOrder', { id: id })
  .then((result) => formatOrder(result.order))
) }

const getTradesHistory = function(pair, limit = 20, page = 0) { return (
  this.send('getTradesHistory', { pair: pair, limit: limit, page: page })
  .then((result) => {
    result.trades = result.trades.map(formatTrade)
    return result
  })
) }

const getTradesOfOrder = function(id) { return (
  this.send('getTradesOfOrder', { id: id })
  .then((result) => result.trades.map(formatTrade))
) }

const getPosition = function(pair) { return (
  this.send('getPosition', { trading_pair: pair })
  .then((result) => formatPosition(result.position))
) }

const closePosition = function(pair) { return (
  this.send('closePosition', { trading_pair: pair })
  .then((result) => formatOrder(result.order))
) }

const claimPosition = function(pair, size) { return (
  this.send('claimPosition', { trading_pair: pair, size: size })
) }

module.exports = {
  listOrders,
  placeLimitOrder,
  placeMarketOrder,
  placeLimitStopOrder,
  placeMarketStopOrder,
  placeOrder,
  cancelOrder,
  getOrder,
  modifyOrder,
  getTradesHistory,
  getTradesOfOrder,
  getPosition,
  closePosition,
  claimPosition,
}
