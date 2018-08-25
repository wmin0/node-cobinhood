const send = require('./send')
const Decimal = require('decimal.js')

const formatFunding = (funding) => ({
  id: funding.id,
  period: funding.period,
  type: funding.type,
  interestRate: new Decimal(funding.interest_rate),
  size: new Decimal(funding.size),
  filled: new Decimal(funding.filled),
  currency: funding.currency,
  side: funding.side,
  state: funding.state,
  completedAt: funding.completed_at? new Date(funding.completed_at): null,
  autoRefund: funding.auto_refund,
  positionID: funding.position_id,
  timestamp: new Date(funding.timestamp),
})

const formatLoan = (loan) => ({
  id: loan.id,
  currency: loan.currency,
  size: new Decimal(loan.size),
  interestRate: new Decimal(loan.interest_rate),
  period: loan.period,
  side: loan.side,
  makerSide: loan.maker_side,
  state: loan.state,
  willCloseAt: new Date(loan.will_close_at),
  completedAt: loan.completed_at? new Date(loan.completed_at): null,
  autoRefund: loan.auto_refund,
})

const listFundings = function() { return (
  this.send('listFundings')
  .then((result) => {
    result.fundings = result.fundings.map(formatFunding)
    return result
  })
) }

const getFunding = function(id) { return (
  this.send('getFunding', { id: id })
  .then((result) => formatFunding(result.funding))
) }

const placeLimitFunding = function(currency, side, interestRate, period, size) { return (
  this.placeFunding(currency, 'limit', side, interestRate, period, size)
) }

const placeFunding = function(currency, type, side, interestRate, period, size) { return (
  this.send('placeFunding', {
    currency: currency,
    type: type,
    side: side,
    interest_rate: interestRate.toString(),
    period: period,
    size: size.toString(),
  })
  .then((result) => formatFunding(result.funding))
) }

const cancelFunding = function(id) { return (
  this.send('cancelFunding', { id: id })
) }

const listLoans = function() { return (
  this.send('listLoans')
  .then((result) => {
    result.loans = result.loans.map(formatLoan)
    return result
  })
) }

const getLoan = function(id) { return (
  this.send('getLoan', { id: id })
  .then((result) => formatLoan(result.loan))
) }

const closeLoan = function(id) { return (
  this.send('closeLoan', { id: id })
) }

module.exports = {
  listFundings,
  getFunding,
  placeLimitFunding,
  placeFunding,
  cancelFunding,
  listLoans,
  getLoan,
  closeLoan,
}
