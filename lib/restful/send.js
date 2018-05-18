const request = require('request')
const querystring = require('querystring')
const api = require('./api')
const debug = require('debug')('node-cobinhood:restful')

const cobinhoodURL = 'https://api.cobinhood.com'
const cobinhoodOrigin = 'https://cobinhood.com'

const send = function(name, args = {}) {
  let info = api[name]
  if (!info) {
    return Promise.reject()
  }
  let path = info.path.replace(/:([a-z_]+)/g, (all, key) => {
    let v = args[key] || ''
    delete args[key]
    return v
  })
  let url = `${cobinhoodURL}${path}`
  if (info.method === 'GET') {
    url += `?${querystring.encode(args)}`
    args = undefined
  }
  return new Promise((resolve, reject) => {
    debug(`send to ${url}`)
    let req = request({
      method: info.method,
      body: args,
      json: true,
      url: url,
      headers: {
        Origin: cobinhoodOrigin,
        Authorization: this.key,
        Nonce: new Date().valueOf(),
      }
    }, (error, status, body) => {
      if (error) {
        return reject(error)
      }
      debug(`resp: ${JSON.stringify(body, 2, 2)}`)
      if (!body.success) {
        body.error.request_id = body.request_id
        return reject(body.error)
      }
      return resolve(body.result)
    })
  })
}

module.exports = send
