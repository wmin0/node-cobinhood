const send = require('./send')

const listOrders = function() { return (
  send(this, 'listOrders')
) }

const placeOrder = function(pair, type, side, price, size) { return (
  send(this, 'placeOrder', {
    trading_pair_id: pair,
    type: type,
    side: side,
    price: price.toString(),
    size: size.toString(),
  })
  .then((result) => result.order)
) }

const cancelOrder = function(id) { return (
 send(this, 'cancelOrder', { id: id })
) }

const modifyOrder = function(id, pair, price, size) { return (
  send(this, 'modifyOrder', {
    id: id,
    trading_pair_id: pair,
    price: price.toString(),
    size: size.toString(),
  })
) }

const getOrder = function(id) { return (
  send(this, 'getOrder', { id: id })
  .then((result) => result.order)
) }

module.exports = {
  listOrders,
  placeOrder,
  cancelOrder,
  getOrder,
  modifyOrder,
}
