const Decimal = require('decimal.js')

const listTradingPairs = function() { return (
  this.send('tradingPairs')
  .then((result) => Promise.all(result.trading_pairs.map(
    (rawPair) => (
      this.getPrecisions(rawPair.id)
      .then((precision) => [rawPair, precision])
    )
  )))
  .then((result) => result.map(
    ([rawPair, precisions]) => ({
      id: rawPair.id,
      base: rawPair.base_currency_id,
      quote: rawPair.quote_currency_id,
      maxSize: new Decimal(rawPair.base_max_size),
      minSize: new Decimal(rawPair.base_max_size),
      increment: new Decimal(rawPair.quote_increment),
      precisions: precisions,
    })
  ))
) }

const getPrecisions = function(pair) { return (
  this.send('getPrecisions', { trading_pair: pair })
  .then((result) => (
    result
    .map((precision) => new Decimal(precision))
    .sort((a, b) => a.lt(b)? -1: a.eq(b)? 0: 1)
  ))
) }

const getOrderbook = function(pair, precision) { return (
  this.send('getOrderbook', { trading_pair: pair, precision: precision })
  .then((result) => result.orderbook)
) }

const listTrades = function(pair) { return (
  this.send('listTrades', { trading_pair: pair })
) }

module.exports = {
  getPrecisions,
  listTradingPairs,
  getOrderbook,
  listTrades
}
