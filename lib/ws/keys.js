const getPreprocessKey = (type) => {
  // hard code change style
  if (type === 'orderbook') {
    type = 'order-book'
  }
  return `preprocess.${type}`
}

const getSubscribeKey =
  ({ type, trading_pair_id, precision, timeframe }) =>
  `${type}${trading_pair_id}${precision}${timeframe}`

module.exports = {
  getPreprocessKey,
  getSubscribeKey
}
