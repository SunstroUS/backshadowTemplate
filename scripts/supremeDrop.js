const cheerio = require('cheerio');
const rp = require('request-promise');
const _ = require('lodash');

const options = {
  url : 'https://www.supremecommunity.com/season/latest/droplists/',
  transform: function (body) {
    return cheerio.load(body);
  }
}

const itemCollection = []

// Go to SupCom and grab the latest weeks href
function start(){
  // Make a request
  return new Promise(function(resolve, reject) {
    rp(options).then($ => {
      var latest_url = $('.block');

      if(latest_url.is('h2') === false) {
          var href = (latest_url.first().attr('href'));
          resolve(href)
      } else {
          console.log('Tryin again');
          reject("Couldn't find link")
      }   
    }).catch((err) => {console.log(err)})
  })
}

// Go to latest week and grab every item
function goToLatestDrop(href) {
  var options = {
    url: href,
    transform: function (body) {
      return cheerio.load(body);
    }
  }
  return new Promise(function(resolve, reject) {
      rp(options).then($ => {
      let listObj = {}
      var item = $('.card-details')
      const names = []
      const prices = []
      const images = []

      if(item) {
        item.each((i, el) => {
          names[i] = $(el).attr('data-itemname');
          prices[i] = $(el).find(".label-price").text().trim();
          images[i] = $(el).find('img').attr('src');
        })
        listObj.names = names
        listObj.images = images
        listObj.prices = prices
        resolve(listObj)
      } else {
        reject()
      }
      }).catch((err) => {
      console.log(err)
  })
})
}

// Sort through every item
function sort(listObj) {
  // Empty out itemCollection
  itemCollection.splice(0,itemCollection.length)
  
  return new Promise(function(resolve, reject) {
    for(i = 0; i < listObj.names.length; i++) {
      let obj = {}
      obj.name = listObj.names[i]
      obj.image = `https://www.supremecommunity.com${listObj.images[i]}`
      obj.price = listObj.prices[i]

      itemCollection.push(obj)
    }
    resolve(itemCollection)
  })
}

async function startScrape() {
  let href = await start()
  let listObj = await goToLatestDrop(`https://www.supremecommunity.com/${href}`)
  let items = await sort(listObj)

  return items
}

module.exports = {
  startScrape
}
