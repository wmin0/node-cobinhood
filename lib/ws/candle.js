const keys = require('./keys')

const type = 'candle'
const getChannelKey =
  ({ trading_pair_id, timeframe }) =>
  `${type}.${trading_pair_id}.${timeframe}`

const preprocess = function(msg) {
  this.socket.emit(msg.channel_id, msg)
}

module.exports = {
  getChannelKey,
  preprocess,
}
