const Decimal = require('decimal.js')

const formatNumber = (num, fixed = 2) => Number(num).toFixed(fixed).replace(/(\d)(?=(\d{3})+(?:\.|$))/g, '$1,');

const toPascalCase = (s) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)

class Fraction {
  constructor(numerator, denominator) {
    if (!(numerator instanceof Decimal)) {
      throw `numerator need to be decimal`
    }
    if (!(denominator instanceof Decimal)) {
      throw `denominator need to be decimal`
    }
    this.numerator = numerator
    this.denominator = denominator
  }
  mul(f) {
    return new Fraction(
      this.numerator.mul(f.numerator),
      this.denominator.mul(f.denominator)
    )
  }
  div(f) {
    return new Fraction(
      this.numerator.mul(f.denominator),
      this.denominator.mul(f.numerator)
    )
  }
  inv() {
    return new Fraction(
      this.denominator,
      this.numerator
    )
  }
  gt(f) {
    return this.numerator.mul(f.denominator).gt(f.numerator.mul(this.denominator))
  }
  lt(f) {
    return this.numerator.mul(f.denominator).lt(f.numerator.mul(this.denominator))
  }
  toString() {
    return `${this.numerator}/${this.denominator}`
  }
  toNumber() {
    return this.toDecimal().toNumber()
  }
  toDecimal() {
    return this.numerator.div(this.denominator)
  }
}

module.exports = {
  toPascalCase,
  Fraction,
  formatNumber,
}
