const api = {
  tradingPairs: {
    path: '/v1/market/trading_pairs',
    method: 'GET',
  },
  currencies: {
    path: '/v1/market/currencies',
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
  listOrderbookPrecisions: {
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
  transferWalletBalance: {
    path: '/v1/wallet/transfer',
    method: 'POST',
  },
  getTicker: {
    path: '/v1/market/tickers/:trading_pair',
    method: 'GET',
  },
  getCandles: {
    path: '/v1/chart/candles/:trading_pair',
    method: 'GET',
  },
  getLoanTicker: {
    path: '/v1/market/loan_tickers/:currency',
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
  getFundingbook: {
    path: '/v1/market/fundingbooks/:currency',
    method: 'GET',
  },
  listFundingbookPrecisions: {
    path: '/v1/market/fundingbook/precisions/:currency',
    method: 'GET',
  },
  listFundings: {
    path: '/v1/funding/fundings',
    method: 'GET',
  },
  getFunding: {
    path: '/v1/funding/fundings/:id',
    method: 'GET',
  },
  placeFunding: {
    path: '/v1/funding/fundings',
    method: 'POST',
  },
  cancelFunding: {
    path: '/v1/funding/fundings/:id',
    method: 'DELETE',
  },
  listLoans: {
    path: '/v1/funding/loans',
    method: 'GET',
  },
  getLoan: {
    path: '/v1/funding/loans/:id',
    method: 'GET',
  },
  closeLoan: {
    path: '/v1/funding/loans/:id',
    method: 'DELETE',
  },
}

module.exports = api
