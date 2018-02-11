const keys = require('./keys')

const type = 'order'
const getChannelKey = () => type

const preprocess = function(msg) {
  this.socket.emit(msg.channel_id, msg)
}

module.exports = {
  getChannelKey,
  preprocess,
}
