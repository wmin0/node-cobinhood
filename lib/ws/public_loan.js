const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'loan'
const getType = () => type
const getChannelKey = ({ currency_id }) => `${type}.${currency_id}`

// TODO: correct format
const formatLoan = (loan) => ({
  id: loan[0],
  timestamp: new Date(parseInt(loan[1], 10)),
  willCloseAt: new Date(parseInt(loan[2], 10)),
  completedAt: loan[3]? new Date(parseInt(loan[3], 10)): null,
  currency: loan[4],
  state: loan[5],
  event: loan[6],
  interestRate: new Decimal(loan[7]),
  size: new Decimal(loan[8]),
  period: parseInt(loan[9], 10),
  autoRefund: loan[11] === 'true',
  side: loan[12],
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
