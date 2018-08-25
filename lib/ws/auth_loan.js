const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'loan-update'
const getType = () => type
const getChannelKey = ({ currency_id }) => `${type}.${currency_id}`

// TODO: correct format
const formatLoan = (loan) => ({
  id: loan[0],
})

const preprocess = function(msg) {
  switch (msg.type) {
    case 'u': {
      msg.update = msg.data.map(formatLoan)
    } break
    case 's': {
      msg.snapshot = msg.data.map(formatLoan)
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
