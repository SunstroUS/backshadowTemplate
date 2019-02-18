let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');

function getProxies(amount) {
    console.log("running")

    return new Promise(function(resolve, reject) {

        let proxies = [];

        axios.get('https://www.us-proxy.org/')
            .then((response) => {
                if(response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                for (let index = 1; index < amount; index++) {
                    var ip = $(`#proxylisttable > tbody > tr:nth-child(${index}) > td:nth-child(1)`).text();
                    var port = $(`#proxylisttable > tbody > tr:nth-child(${index}) > td:nth-child(2)`).text();
                    proxies.push(ip + port)
                }
                if(proxies) {
                    resolve(proxies)
                  } else {
                    reject("Cannot get proxies")
                  }

        
            }
        
            }, (error) => console.log(err) );
        });
    
}

module.exports = {
    getProxies
}