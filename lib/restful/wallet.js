const send = require('./send')
const Decimal = require('decimal.js')

const formatBalance = (balance) => ({
  currency: balance.currency,
  type: balance.type,
  total: new Decimal(balance.total),
  onOrder: new Decimal(balance.on_order),
  btcValue: new Decimal(balance.btc_value),
  usdValue: new Decimal(balance.usd_value),
  locked: balance.locked,
})

const getBalance = function() { return (
  this.send('getWalletBalance')
  .then((result) => result.balances.map(formatBalance))
) }

const transferBalance = function(currency, from, to, amount) { return (
  this.send('transferWalletBalance', {
    currency: currency,
    from: from,
    to: to,
    amount: amount.toString(),
  })
) }

module.exports = {
  getBalance,
  transferBalance,
}
