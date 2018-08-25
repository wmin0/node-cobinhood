const keys = require('./keys')
const Decimal = require('decimal.js')

const type = 'order'
const getType = () => type
const getChannelKey = () => type

const formatOrder = (type, order) => {
  let obj = {
    id: order[0],
    timestamp: new Date(parseInt(order[1], 10)),
    completedAt: order[2]? new Date(parseInt(order[2], 10)): null,
    tradingPair: order[3],
    state: order[4],
    event: order[5],
    side: order[6],
  }
  switch (type) {
    case '0': {
      obj = Object.assign({
        type: 'limit',
        price: new Decimal(order[7]),
        eqPrice: order[8]? new Decimal(order[8]): null,
        size: new Decimal(order[9]),
        filled: new Decimal(order[10]),
      }, obj)
    } break
    case '1': {
      obj = Object.assign({
        type: 'market',
        eqPrice: order[7]? new Decimal(order[7]): null,
        size: new Decimal(order[8]),
        filled: new Decimal(order[9]),
      }, obj)
    } break
    case '2': {
      obj = Object.assign({
        type: 'market_stop',
        eqPrice: order[7]? new Decimal(order[7]): null,
        size: new Decimal(order[8]),
        filled: new Decimal(order[9]),
        stopPrice: new Decimal(order[10]),
      }, obj)

      obj.type = 'market_stop'
    } break
    case '3': {
      obj = Object.assign({
        type: 'limit_stop',
        price: new Decimal(order[7]),
        eqPrice: order[8]? new Decimal(order[8]): null,
        size: new Decimal(order[9]),
        filled: new Decimal(order[10]),
        stopPrice: new Decimal(order[11]),
      }, obj)
    } break
  }
  return obj
}

const preprocess = function(msg) {
  switch (msg.type) {
    case 'u': {
      msg.update = formatOrder(msg.code, msg.data)
    } break
  }
  this.socket.emit(msg.channel, msg)
}

module.exports = {
  getType,
  getChannelKey,
  preprocess,
}
