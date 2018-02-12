const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'order'
const getChannelKey = () => type

const formatOrder = (order) => ({
  id: order[0],
  tradingPair: order[1],
  state: order[2],
  side: order[3],
  type: order[4],
  price: new Decimal(order[5]),
  eqPrice: new Decimal(order[6]),
  size: new Decimal(order[7]),
  filled: new Decimal(order[8]),
  timestamp: new Date(order[9]),
})

const preprocess = function(msg) {
  if (msg.update) {
    msg.update = formatOrder(msg.update)
  }
  this.socket.emit(msg.channel_id, msg)
}

module.exports = {
  getChannelKey,
  preprocess,
}
