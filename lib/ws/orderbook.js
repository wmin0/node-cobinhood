const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'order-book'
const getType = () => type
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
  switch (msg.type) {
    case 'u': {
      msg.update = {
        bids: msg.data.bids.map(formatPricePointUpdate),
        asks: msg.data.asks.map(formatPricePointUpdate),
      }
    } break
    case 's': {
      msg.snapshot = {
        bids: msg.data.bids.map(formatPricePoint),
        asks: msg.data.asks.map(formatPricePoint),
      }
      break
    }
  }
  this.socket.emit(msg.channel, msg)
}

module.exports = {
  getType,
  getChannelKey,
  preprocess,
}
