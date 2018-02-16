# Node-Cobinhood
node-cobinhood is a nodejs api wrapper of cobinhood restful api and websocket.
node-cobinhood provides an easier way to access cobinhood exchange.

# Getting Started
You should get an [api key](https://cobinhood.com/api) of cobinhood first.
Put your api key in one of example and try it!

# Client Instance
With api key, you can create a client with following code.

```javascript
const Client = require('cobinhood')
let client = new Client(`your api key`)
```

Then you can access cobinhood exchange throgh RESTFUL API or Websocket.

## Disable Websocket
If you don't want to connect ws, specify in constructor.

```javascript
const Client = require('cobinhood', true)
let client = new Client(`your api key`)
```

## RESTFUL API
You can access cobinhood exchange with such client method below.
RESTFUL API will returns a promise object.

* listOrders()
* listTradingPairs()
* placeLimitOrder(pair, side, price, size)
- pair: trading pair
- side: "bid" or "ask"
- price: price, string or decimal object
- size: size, string or decimal object
* placeMarketOrder(pair, side, size)
- pair: trading pair
- side: "bid" or "ask"
- size: size, string or decimal object
* cancelOrder(id)
- id: order id
* getOrder(id)
- id: order id
* modifyOrder(id, pair, price, size)
- id: order id
- pair: trading pair
- price: price, string or decimal object
- size: size, string or decimal object
* getBalance()
* getOrderbook(pair, precision)
- pair: trading pair
- precision: trading pair support precision, for example new Decimal("1e-7") or "1E-7"
* listTrades(pair)
- pair: trading pair

## Websocket
Upon client created, websocket is connecting, so you should call client close if you don't need it.
Client provides some websocket events.
You can listen events to know the situation.

### Events
* open
When websocket connected, it will be fired.
* close
When websocket closed, it will be fired.
* error
When websocket error, it will be fired.

### Subscribes
You can subscribe websocket update with such client method below.
Subscription function will returns a promise object.

* subscribeOrder(fn)
- fn: callback function
* subscribeTicker(pair, fn)
- pair: trading pair, for example "COB-ETH"
- fn: callback function
* subscribeTrade(pair, fn)
- pair: trading pair, for example "COB-ETH"
- fn: callback function
* subscribeOrderbook(pair, precision, fn)
- pair: trading pair, for example "COB-ETH"
- precision: trading pair support precision, for example new Decimal("1e-7") or "1E-7"
- fn: callback function
* subscribeCandle(pair, timeframe, fn)
- pair: trading pair, for example "COB-ETH"
- timeframe: candle timeframe, for example "1h", "15m"
- fn: callback function
