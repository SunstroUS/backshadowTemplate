const math = require('mathjs')

function mafPayP (value) {
    var answer = math.chain(value)
    .multiply(.971)
    .subtract(.3)
    .done() // 14

    return answer
}

function mafEbay (value) {
  if(value <= 50) {
    var answer = math.chain(value)
    .multiply(.88)
    .done() // 14
  } else if (value > 50.01 && value <= 1000) {
    var answer = math.chain(value)
    .multiply(.79)
    .done() // 14
  } else if (value > 1000.01) {
    var answer = math.chain(value)
    .multiply(.77)
    .done() // 14
  }
    var answer = math.chain(value)
    .multiply(.87)
    .done() // 14
  return answer
}

function mafStockx(value) {
    var answer = math.chain(value)
    .multiply(.875)
    .done() // 14

    return answer
}

function mafGrailed (value) {
    var answer = math.chain(value)
    .multiply(.911)
    .subtract(.3)
    .done() // 14

    return answer
}

function mafGoat (value) {
    var answer = math.chain(value)
    .multiply(.905)
    .subtract(5)
    .done() // 14

    return answer
}

module.exports = {
    mafGoat,
    mafGrailed,
    mafPayP,
    mafEbay,
    mafStockx
}