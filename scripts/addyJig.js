function makeid() {

  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < 3; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
module.exports = {
  makeid
}