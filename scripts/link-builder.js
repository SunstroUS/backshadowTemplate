const request = require("request-promise");

let link_builder = {};

link_builder.build = function(url, callback) {
  let links = [];
  let title = [];
  let img = [];

  // Make the request
  request({
    method: "get",
    url: `${url}.json`,
    gzip: true,
    json: true,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3107.4 Safari/537.36"
    }
  })
    .then(function(json) {
      json.product.variants.forEach(function(size) {
        let atclink = `${size.title} - http://${
          url.split("//")[1].split("/")[0]
        }/cart/${size.id}:1`;
        links.push(atclink);
      });
      let name = `${json.product.title}`;
      let picture = `${json.product.image.src}`;

      title.push(name);
      img.push(picture);

      return callback(null, title, links, img, "#648767");
    })
    .catch(function(e) {
      title.push("N/A");
      links.push("Unable to find variants for that item");

      return callback(e, title, links, null, "#A3333D");
    });
};

module.exports = link_builder;
