const send = require('./send')
const Decimal = require('decimal.js')

const formatBalance = (balance) => ({
  currency: balance.currency,
  type: balance.type,
  total: new Decimal(balance.total),
  onOrder: new Decimal(balance.on_order),
  locked: balance.locked,
})

const getBalance = function() { return (
  this.send('getWalletBalance')
  .then((result) => result.balances.map(formatBalance))
) }

module.exports = {
  getBalance
}
