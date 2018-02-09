const send = require('./send')

const getBalance = function() { return (
  send(this, 'getWalletBalance').then(({ balances }) => balances)
) }

module.exports = {
  getBalance
}
