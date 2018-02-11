const send = require('./send')

const getBalance = function() { return (
  this.send('getWalletBalance').then(({ balances }) => balances)
) }

module.exports = {
  getBalance
}
