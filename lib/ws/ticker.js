const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'ticker'
const getChannelKey = ({ trading_pair_id }) => `${type}.${trading_pair_id}`

const formatTicker = (ticker) => ({
  timestamp: new Date(parseInt(ticker[0], 10)),
  highestBid: new Decimal(ticker[1]),
  lowestAsk: new Decimal(ticker[2]),
  volume24HR: new Decimal(ticker[3]),
  high24HR: new Decimal(ticker[4]),
  low24HR: new Decimal(ticker[5]),
  open24HR: new Decimal(ticker[6]),
  lastTradePrice: new Decimal(ticker[7]),
})

const preprocess = function(msg) {
  switch (msg.type) {
    case 'u': {
      msg.update = formatTicker(msg.data)
    } break
    case 's': {
      msg.snapshot = formatTicker(msg.data)
      break
    }
  }
  this.socket.emit(msg.channel, msg)
}

module.exports = {
  getChannelKey,
  preprocess,
}
