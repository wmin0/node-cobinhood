const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'funding'
const getType = () => type
const getChannelKey = () => type

// TODO: correct format
const formatFunding = (type, funding) => {
  let obj = {
    id: funding[0],
    timestamp: new Date(parseInt(funding[1], 10)),
    completedAt: funding[2]? new Date(parseInt(funding[2], 10)): null,
    currency: funding[3],
    state: funding[4],
    event: funding[5],
    side: funding[6],
    interestRate: new Decimal(funding[7]),
    size: new Decimal(funding[8]),
    filled: new Decimal(funding[9]),
    period: parseInt(funding[10], 10),
    autoRefund: funding[11] === 'true',
  }
  switch (type) {
    case '0': {
      obj = Object.assign({
        type: 'limit',
      }, obj)
    } break
    case '1': {
      obj = Object.assign({
        type: 'market',
      }, obj)
    } break
  }
  return obj
}

const preprocess = function(msg) {
  switch (msg.type) {
    case 'u': {
      msg.update = formatFunding(msg.code, msg.data)
    } break
  }
  this.socket.emit(msg.channel, msg)
}

module.exports = {
  getType,
  getChannelKey,
  preprocess,
}
