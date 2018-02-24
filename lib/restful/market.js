const Decimal = require('decimal.js')

const formatPricePoint = (point) => ({
  price: new Decimal(point[0]),
  count: parseInt(point[1], 10),
  size: new Decimal(point[2]),
})

const formatTrade = (trade) => ({
  id: trade.id,
  timestamp: new Date(trade.timestamp),
  makerSide: trade.marker_side,
  price: new Decimal(trade.price),
  size: new Decimal(trade.size)
})

const formatTradingPair = (pair) => ({
  id: pair.id,
  base: pair.base_currency_id,
  quote: pair.quote_currency_id,
  maxSize: new Decimal(pair.base_max_size),
  minSize: new Decimal(pair.base_max_size),
  increment: new Decimal(pair.quote_increment),
  precisions: pair.precisions || [],
  isActive: pair.is_active,
})

const listTradingPairs = function() { return (
  this.send('tradingPairs')
  .then((result) => Promise.all(result.trading_pairs.map(
    (rawPair) => {
      if (!rawPair.is_active) {
        return rawPair
      }
      return (
        this.getPrecisions(rawPair.id)
        .then((precisions) => {
          rawPair.precisions = precisions
          return rawPair
        })
      )
    }
  )))
  .then((result) => result.map(formatTradingPair))
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
  .then((result) => {
    let orderbook = result.orderbook
    if (orderbook.bids) {
      orderbook.bids = orderbook.bids.map(formatPricePoint)
    }
    if (orderbook.asks) {
      orderbook.asks = orderbook.asks.map(formatPricePoint)
    }
    return orderbook
  })
) }

const listTrades = function(pair) { return (
  this.send('listTrades', { trading_pair: pair })
  .then((result) => result.trades.map(formatTrade))
) }

module.exports = {
  getPrecisions,
  listTradingPairs,
  getOrderbook,
  listTrades
}
