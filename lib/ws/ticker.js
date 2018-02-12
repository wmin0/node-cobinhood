const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'ticker'
const getChannelKey = ({ trading_pair_id }) => `${type}.${trading_pair_id}`

const formatTicker = (ticker) => ({
  lastTradePrice: new Decimal(ticker[1]),
  highestBid: new Decimal(ticker[2]),
  lowestAsk: new Decimal(ticker[3]),
  '24hrVolume': new Decimal(ticker[4]),
  '24hrHigh': new Decimal(ticker[5]),
  '24hrLow': new Decimal(ticker[6]),
  '24hrOpen': new Decimal(ticker[7]),
  timestamp: new Date(ticker[8]),
})

const preprocess = function(msg) {
  if (msg.update) {
    msg.update = formatTicker(msg.update)
  }
  if (msg.snapshot) {
    msg.snapshot = msg.snapshot.map(formatTicker)
  }
  this.socket.emit(msg.channel_id, msg)
}

module.exports = {
  getChannelKey,
  preprocess,
}
