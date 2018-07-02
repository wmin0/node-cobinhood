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
  getTradesHistory: {
    path: '/v1/trading/trades',
    method: 'GET',
  },
  getTradesOfOrder: {
    path: '/v1/trading/orders/:id/trades',
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
  },
  getTicker: {
    path: '/v1/market/tickers/:trading_pair',
    method: 'GET',
  },
  getCandles: {
    path: '/v1/chart/candles/:trading_pair',
    method: 'GET',
  },
  listPositions: {
    path: '/v1/trading/positions',
    method: 'GET',
  },
  getPosition: {
    path: '/v1/trading/positions/:trading_pair',
    method: 'GET',
  },
  closePosition: {
    path: '/v1/trading/positions/:trading_pair',
    method: 'DELETE',
  },
  claimPosition: {
    path: '/v1/trading/positions/:trading_pair',
    method: 'PATCH',
  },
}

module.exports = api
