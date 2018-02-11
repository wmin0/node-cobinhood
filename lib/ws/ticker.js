const keys = require('./keys')

const type = 'ticker'
const getChannelKey = ({ trading_pair_id }) => `${type}.${trading_pair_id}`

const preprocess = function(msg) {
  this.socket.emit(msg.channel_id, msg)
}

module.exports = {
  getChannelKey,
  preprocess,
}
