const getPreprocessKey = (type) => {
  // hard code change style
  if (type === 'orderbook') {
    type = 'order-book'
  }
  return `preprocess.${type}`
}

module.exports = {
  getPreprocessKey,
}
