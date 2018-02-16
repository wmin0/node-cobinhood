const send = require('./send')
const Decimal = require('decimal.js')

const formatOrder = (order) => ({
  id: order.id,
  tradingPair: order.trading_pair,
  side: order.side,
  type: order.type,
  size: new Decimal(order.size),
  price: new Decimal(order.price),
  filled: new Decimal(order.filled),
  state: order.state,
  timestamp: new Date(order.timestamp),
  eqPrice: new Decimal(order.eq_price),
  completedAt: order.completed_at? new Date(order.completed_at): null,
})

const listOrders = function() { return (
  this.send('listOrders')
  .then((result) => {
    result.orders = result.orders.map(formatOrder)
    return result
  })
) }

const placeLimitOrder = function(pair, side, price, size) { return (
  this.placeOrder(pair, 'limit', side, price, size)
) }

const placeMarketOrder = function(pair, side, size) { return (
  this.placeMarketOrder(pair, 'market', side, '0', size)
) }

const placeOrder = function(pair, type, side, price, size) { return (
  this.send('placeOrder', {
    trading_pair_id: pair,
    type: type,
    side: side,
    price: price.toString(),
    size: size.toString(),
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

module.exports = {
  listOrders,
  placeLimitOrder,
  placeMarketOrder,
  cancelOrder,
  getOrder,
  modifyOrder,
}
