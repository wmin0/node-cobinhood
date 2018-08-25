const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'candle'
const getType = () => type
const getChannelKey =
  ({ trading_pair_id, timeframe }) =>
  `${type}.${trading_pair_id}.${timeframe}`

const formatCandle = (candle) => ({
  timestamp: new Date(parseInt(candle[0], 10)),
  open: new Decimal(candle[1]),
  close: new Decimal(candle[2]),
  high: new Decimal(candle[3]),
  low: new Decimal(candle[4]),
  volume: new Decimal(candle[5]),
})

const preprocess = function(msg) {
  switch (msg.type) {
    case 'u': {
      msg.update = formatCandle(msg.data[0])
    } break
    case 's': {
      msg.snapshot = msg.data.map(formatCandle)
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
