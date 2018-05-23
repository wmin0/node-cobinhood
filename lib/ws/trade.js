const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'trade'
const getChannelKey = ({ trading_pair_id }) => `${type}.${trading_pair_id}`

const formatTrade = (trade) => ({
  id: trade[0],
  timestamp: new Date(trade[1]),
  side: trade[2],
  price: new Decimal(trade[3]),
  size: new Decimal(trade[4]),
})

const preprocess = function(msg) {
  switch (msg.type) {
    case 'u': {
      msg.update = msg.data.map(formatTrade)
    } break
    case 's': {
      msg.snapshot = msg.data.map(formatTrade)
      break
    }
  }
  this.socket.emit(msg.channel, msg)
}

module.exports = {
  getChannelKey,
  preprocess,
}
