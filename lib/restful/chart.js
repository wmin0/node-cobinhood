const Decimal = require('decimal.js')

const formatCandle = (candle) => ({
  timestamp: new Date(candle.timestamp),
  open: new Decimal(candle.open),
  close: new Decimal(candle.close),
  high: new Decimal(candle.high),
  low: new Decimal(candle.low),
  volume: new Decimal(candle.volume),
})

const getCandles = function(pair, start, end, timeframe) { return (
  this.send('getCandles', {
    trading_pair: pair,
    start_time: start.valueOf(),
    end_time: end.valueOf(),
    timeframe: timeframe,
  })
  .then((result) => result.candles.map(formatCandle))
) }

module.exports = {
  getCandles,
}
