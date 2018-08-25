const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'funding-book'
const getType = () => type
const getChannelKey =
  ({ currency_id, precision }) =>
  `${type}.${currency_id}.${precision}`

const formatPricePoint = (point) => ({
  interest: new Decimal(point[0]),
  count: parseInt(point[1], 10),
  size: new Decimal(point[2]),
  minPeriod: parseInt(point[3], 10),
  maxPeriod: parseInt(point[4], 10),
})

const formatPricePointUpdate = (point) => ({
  interest: new Decimal(point[0]),
  countDiff: parseInt(point[1], 10),
  sizeDiff: new Decimal(point[2]),
  minPeriodDiff: parseInt(point[3], 10),
  maxPeriodDiff: parseInt(point[4], 10),
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
