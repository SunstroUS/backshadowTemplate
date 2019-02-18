const Discord = require("discord.js");
const SitemapGenerator = require("sitemap-generator");
const fs = require("fs");
const _ = require("lodash");
const ping = require("ping");

const config = require("./config.json");

const sDrops = require("./scripts/supremeDrop");
const wbBuilder = require("./scripts/webhookBuilder");
const smsBuilder = require("./scripts/sendText");
const linkBuilder = require("./scripts/link-builder");
const addyJig = require("./scripts/addyJig");
const math = require("./scripts/math.js");
const funkoScrape = require("./scripts/funkoScrape.js");
const lowProxies = require("./scripts/lowProxies.js");

const client = new Discord.Client();

client.on("ready", () => {
  console.log("Bot turned on");
});

client.on("message", message => {
  // Turn into args
  var words = message.content.trim().split(/ +/g);

  // If it's not a command or a bot sent the message or it's not in the right channel, then ignore
  if (
    !words[0].startsWith("/") ||
    message.author.bot ||
    message.channel.id != config.channels.main
  )
    return;

  // Define command
  var command = words.shift().toLowerCase();
  console.log(words.toString());

  /**
   *
   * Basic Tier List
   *
   */

  if (command == "/address") {
    // ADDRESS COMMAND
    let address = words.toString().replace(/,/g, " ");
    let jAddy1 = addyJig.makeid() + " " + address + "\n";
    let jAddy2 = addyJig.makeid() + " " + address + "\n";
    let jAddy3 = addyJig.makeid() + " " + address + "\n";
    let jAddy4 = addyJig.makeid() + " " + address + "\n";
    let jAddy5 = addyJig.makeid() + " " + address + "\n";
    message.channel.send(
      wbBuilder.buildNewEmbed(
        config.discord_embed.color,
        config.discord_embed.title,
        config.discord_embed.url,
        config.groupName,
        config.discord_embed.icon_url,
        config.discord_embed.url,
        "Addresses for you",
        `${jAddy1} ${jAddy2} ${jAddy3} ${jAddy4} ${jAddy5}`,
        "",
        config.discord_embed.icon_url,
        "Address Jig",
        config.discord_embed.icon_url
      )
    );
  }

  if (command == "/fee") {
    // FEE COMMAND
    let number = words;

    let paypal = math.mafPayP(number);
    let eBay = math.mafEbay(number);
    let stockx = math.mafStockx(number);
    let grailed = math.mafGrailed(number);
    let goat = math.mafGoat(number);
    message.channel.send(
      wbBuilder.buildNewEmbed(
        config.discord_embed.color,
        config.discord_embed.title,
        config.discord_embed.url,
        config.groupName,
        config.discord_embed.icon_url,
        config.discord_embed.url,
        "Fees",
        `Paypal: ${paypal} \n eBay: ${eBay} \n StockX: ${stockx} \n Grailed: ${grailed} \n Goat: ${goat}`,
        "",
        config.discord_embed.icon_url,
        "Fee Calculator",
        config.discord_embed.icon_url
      )
    );
  }

  if (command == "/sdrop") {
    // SUPREME DROP COMMAND

    // Runs supreme drop script
    sDrops.startScrape().then(list => {
      list.forEach(item => {
        message.channel.send(
          wbBuilder.buildNewEmbed(
            config.discord_embed.color,
            config.discord_embed.title,
            config.discord_embed.url,
            config.groupName,
            config.discord_embed.icon_url,
            config.discord_embed.url,
            item.name,
            `Average price: ${item.price}`,
            item.image,
            "https://www.supremecommunity.com/s/img/sclogo_dark.png",
            "footer_name",
            config.discord_embed.icon_url
          )
        );
      });
    });
  }

  if (command == "/funko") {
    // FUNKO PRICE COMMAND (ONLY TWO WORDS)
    var terms = words.join("+");
    funkoScrape.funkoScrape(terms).then(item => {
      message.channel.send(
        wbBuilder.buildNewEmbed(
          config.discord_embed.color,
          config.discord_embed.title,
          config.discord_embed.url,
          config.groupName,
          config.discord_embed.icon_url,
          config.discord_embed.url,
          item.name,
          `Price: ${item.price}`,
          item.image,
          config.discord_embed.icon_url,
          "footer_name",
          config.discord_embed.icon_url
        )
      );
    });
  }

  /**
   *
   * Plugins List
   *
   */

  if (command == "/send") {
    // SEND MESSAGE COMMAND
    // Join words Together
    var content = words.join(" ");

    // Runs script in ./scripts/sendText.js
    smsBuilder.sendText(content);

    // Embed For Success
    message.channel.send(
      wbBuilder.buildNewEmbed(
        config.discord_embed.color,
        config.discord_embed.title,
        config.discord_embed.url,
        config.groupName,
        config.discord_embed.icon_url,
        config.discord_embed.url,
        "Message Sent",
        "Your SMS Message Has Been Delievered!",
        "",
        config.discord_embed.icon_url,
        "Backshadow SMS",
        config.discord_embed.icon_url
      )
    );
  }

  if (command == "/phone_add") {
    // ADD PHONE NUMBER COMMAND
    // Begin By Reading The Json File
    fs.readFile("./phone_numbers.json", "utf-8", function(err, data) {
      if (err) throw err;

      // Read Json data and make into object
      var arrayOfObjects = JSON.parse(data);
      // Push first args to phone_numbers
      arrayOfObjects.phone_numbers.push(words[0]);

      console.log(arrayOfObjects);

      // Write the changes made to the file
      fs.writeFile(
        "./phone_numbers.json",
        JSON.stringify(arrayOfObjects),
        "utf-8",
        function(err) {
          if (err) throw err;
          console.log("Done!");
          message.channel.send(
            wbBuilder.buildNewEmbed(
              config.discord_embed.color,
              config.discord_embed.title,
              config.discord_embed.url,
              config.groupName,
              config.discord_embed.icon_url,
              config.discord_embed.url,
              "Success",
              "Your Number Was Successfully Added!",
              "",
              config.discord_embed.icon_url,
              "Backshadow SMS",
              config.discord_embed.icon_url
            )
          );
        }
      );
    });
  }
  // TO DO(for sms) : BIND DISCORD TO SMS NUMBER

  if (command == "/ping") {
    // PING COMMAND

    // Set the host website to be pinged to the arg
    var host = words[0];

    try {
      // Check if website is alive
      ping.sys.probe(host, function(isAlive) {
        var msg = isAlive
          ? "host " + host + " is alive"
          : "host " + host + " is dead";
        message.channel.send(
          wbBuilder.buildNewEmbed(
            config.discord_embed.color,
            config.discord_embed.title,
            config.discord_embed.url,
            config.groupName,
            config.discord_embed.icon_url,
            config.discord_embed.url,
            "Website Ping",
            msg,
            "",
            config.discord_embed.icon_url,
            "BackShadow Ping",
            config.discord_embed.icon_url
          )
        );
      });
    } catch (e) {
      message.channel.send(
        wbBuilder.buildNewEmbed(
          config.discord_embed.color,
          config.discord_embed.title,
          config.discord_embed.url,
          config.groupName,
          config.discord_embed.icon_url,
          config.discord_embed.url,
          "Website Ping",
          "There was an error pinging your website, make sure your format is the following `www.google.com`",
          "",
          config.discord_embed.icon_url,
          "BackShadow Ping",
          config.discord_embed.icon_url
        )
      );
      console.log(e);
    }
  }

  if (command == "/proxies") {
    // LOW TIER PROXY SCRAPER
    let proxyAmount = words[0];
    lowProxies.getProxies(proxyAmount).then(proxies => {
      message.channel.send(
        wbBuilder.buildNewEmbed(
          config.discord_embed.color,
          config.discord_embed.title,
          config.discord_embed.url,
          config.groupName,
          config.discord_embed.icon_url,
          config.discord_embed.url,
          "Proxies",
          proxies,
          "",
          config.discord_embed.icon_url,
          "Backshadow Proxies",
          config.discord_embed.icon_url
        )
      );
    });
  }

  if (command == "/crawl") {
    // SITEMAP CRAWLER
    // create generator
    const generator = SitemapGenerator(words[0], {
      stripQuerystring: false
    });

    // register event listeners
    generator.on("done", () => {
      // Send Finish Embed
      message.channel.send(
        wbBuilder.buildNewEmbed(
          config.discord_embed.color,
          config.discord_embed.title,
          config.discord_embed.url,
          config.groupName,
          config.discord_embed.icon_url,
          config.discord_embed.url,
          "Sitemap Crawled",
          "The site you requested has been successfully crawled.",
          "",
          config.discord_embed.icon_url,
          "BackShadow Crawler",
          config.discord_embed.icon_url
        )
      );

      // Send File
      message.channel.send("`" + words[0] + "` Sitemap", {
        files: ["sitemap.xml"]
      });
    });

    // start the crawler
    generator.start();
  }

  if (command == "/build") {
    // LINK BUILD
    linkBuilder.build(words[0], (err, title, links, img, color) => {
      // Send embed
      message.channel.send(
        wbBuilder.buildNewEmbed(
          config.discord_embed.color,
          config.discord_embed.title,
          config.discord_embed.url,
          config.groupName,
          config.discord_embed.icon_url,
          config.discord_embed.url,
          title,
          links,
          "",
          config.discord_embed.icon_url,
          "BackShadow Link Builder",
          config.discord_embed.icon_url
        )
      );
    });
  }
});

/* Embed example
message.channel.send(wbBuilder.buildNewEmbed(
  config.discord_embed.color,
  config.discord_embed.title,
  config.discord_embed.url,
  config.groupName,
  config.discord_embed.icon_url,
  config.discord_embed.url,
  'field_title',
  'field_description',
  '',
  config.discord_embed.icon_url,
  'footer_name',
  config.discord_embed.icon_url
  ));
*/

client.login(config.botClientID);
