const fs = require('fs')

const config = require('../config.json')

const client = require('twilio')(config.twilio.account_sid, config.twilio.auth_token);


function sendText(content){
  fs.readFile('./phone_numbers.json', 'utf-8', function(err, data) {
    if (err) throw err

    // Read Json data and make into object
    var arrayOfObjects = JSON.parse(data)

    console.log(arrayOfObjects.phone_numbers)

    // Loop through all of the numbers in phone_numbers
    arrayOfObjects.phone_numbers.forEach(number => {
      client.messages.create({
        body: content,
        from: '+19735281661',
        to: number
      })
      .then(message => console.log(message.sid))
      .done();
    });
  })
}

module.exports = {
  sendText
}
