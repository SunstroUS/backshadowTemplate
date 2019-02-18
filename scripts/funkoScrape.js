const cheerio = require('cheerio');
const rp = require('request-promise');
const _ = require('lodash');

function funkoScrape(terms) {
  const options = {
    url : `https://stashpedia.com/search?terms=${terms}`,
    transform: function (body) {
      return cheerio.load(body);
    }
  }
  return new Promise(function(resolve, reject) {
    rp(options).then($ => {
      var firstObj = $('.formatItemInner.col-xs-12.no-gutter.text-center')[0];
      var childss = firstObj.children

      let obj = {}

      obj.name = $(childss[1]).find(".toUpperCase").text()
      obj.price = $(childss[5]).find(".gridValue").text().trim();

      var href = $(childss[3]).find(".img-responsive.gridImage").attr('src');
      obj.image = `https://stashpedia.com${href}`

      if(obj.name) {
        resolve(obj)
      } else {
        reject("obj undefined")
      }
    }).catch((err) => {console.log(err)})
  })
}

module.exports = {
  funkoScrape
}