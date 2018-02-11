const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'trade'
const getChannelKey = ({ trading_pair_id }) => `${type}.${trading_pair_id}`

const formatTrade = (trade) => ({
  id: trade[0],
  timestamp: new Date(trade[1]),
  price: new Decimal(trade[2]),
  size: new Decimal(trade[3]),
  makerSide: trade[4]
})

const preprocess = function(msg) {
  if (msg.snapshot) {
    msg.snapshot = msg.snapshot.map(formatTrade)
  }
  if (msg.update) {
    msg.update = msg.update.map(formatTrade)
  }
  this.socket.emit(msg.channel_id, msg)
}

module.exports = {
  getChannelKey,
  preprocess,
}
