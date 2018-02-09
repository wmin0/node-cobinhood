const utils = require('./utils')

module.exports = (dirname, modules) => modules.reduce((obj, key) => {
  obj[key] = require(`${dirname}/${utils.toPascalCase(key)}`)
  return obj
}, {})
