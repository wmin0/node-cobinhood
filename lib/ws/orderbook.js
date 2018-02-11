const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'order-book'
const getChannelKey =
  ({ trading_pair_id, precision }) =>
  `${type}.${trading_pair_id}.${precision}`

const formatPricePoint = (point) => ({
  price: new Decimal(point[0]),
  count: parseInt(point[1], 10),
  size: new Decimal(point[2]),
})

const formatPricePointUpdate = (point) => ({
  price: new Decimal(point[0]),
  countDiff: parseInt(point[1], 10),
  sizeDiff: new Decimal(point[2]),
})

const preprocess = function(msg) {
  if (msg.update) {
    msg.update.bids = msg.update.bids.map(formatPricePointUpdate)
    msg.update.asks = msg.update.asks.map(formatPricePointUpdate)
  }
  if (msg.snapshot) {
    msg.snapshot.bids = msg.snapshot.bids.map(formatPricePoint)
    msg.snapshot.asks = msg.snapshot.asks.map(formatPricePoint)
  }
  this.socket.emit(msg.channel_id, msg)
}

module.exports = {
  getChannelKey,
  preprocess,
}
