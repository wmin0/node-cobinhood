const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'loan-ticker'
const getType = () => type
const getChannelKey = ({ currency_id }) => `${type}.${currency_id}`

const formatTicker = (ticker) => ({
  timestamp: new Date(parseInt(ticker[0], 10)),
  volume24HR: new Decimal(ticker[1]),
  high24HR: new Decimal(ticker[2]),
  low24HR: new Decimal(ticker[3]),
  open24HR: new Decimal(ticker[4]),
  lastLoanInterest: new Decimal(ticker[5]),
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
  getType,
  getChannelKey,
  preprocess,
}
