const send = require('./send')

const listOrders = function() { return (
  this.send('listOrders')
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
  .then((result) => result.order)
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
  .then((result) => result.order)
) }

module.exports = {
  listOrders,
  placeLimitOrder,
  placeMarketOrder,
  cancelOrder,
  getOrder,
  modifyOrder,
}
