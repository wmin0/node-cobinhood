const api = {
  tradingPairs: {
    path: '/v1/market/trading_pairs',
    method: 'GET',
  },
  listOrders: {
    path: '/v1/trading/orders',
    method: 'GET',
  },
  listTrades: {
    path: '/v1/market/trades/:trading_pair',
    method: 'GET',
  },
  getOrderbook: {
    path: '/v1/market/orderbooks/:trading_pair',
    method: 'GET',
  },
  getPrecisions: {
    path: '/v1/market/orderbook/precisions/:trading_pair',
    method: 'GET',
  },
  placeOrder: {
    path: '/v1/trading/orders',
    method: 'POST',
  },
  cancelOrder: {
    path: '/v1/trading/orders/:id',
    method: 'DELETE',
  },
  getOrder: {
    path: '/v1/trading/orders/:id',
    method: 'GET',
  },
  modifyOrder: {
    path: '/v1/trading/orders/:id',
    method: 'PUT',
  },
  getWalletBalance: {
    path: '/v1/wallet/balances',
    method: 'GET',
  }
}

module.exports = api
