const keys = require('./keys')

const type = 'candle'
const getChannelKey =
  ({ trading_pair_id, timeframe }) =>
  `${type}.${trading_pair_id}.${timeframe}`

const formatCandle = (candle) => ({
  timestamp: new Date(candle[0]),
  open: new Decimal(candle[1]),
  close: new Decimal(candle[2]),
  high: new Decimal(candle[3]),
  low: new Decimal(candle[4]),
  volume: new Decimal(candle[5]),
})

const preprocess = function(msg) {
  if (msg.update) {
    msg.update = formatCandle(msg.update)
  }
  if (msg.snapshot) {
    msg.snapshot = msg.snapshot.map(formatCandle)
  }
  this.socket.emit(msg.channel_id, msg)
}

module.exports = {
  getChannelKey,
  preprocess,
}
