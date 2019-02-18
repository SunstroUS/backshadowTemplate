const Discord = require('discord.js');

function buildNewEmbed(color, title_name, title_url, author_name, author_icon, author_homepage, field_title, field_description, image, thumbnail, footner_name, footer_icon) {
  const embed = new Discord.RichEmbed()
  .setColor(color)
  .setTitle(title_name)
  .setURL(title_url)
  .setAuthor(author_name, author_icon, author_homepage)
  .addField(field_title, field_description)
  .setImage(image)
  .setThumbnail(thumbnail)
  .setTimestamp()
  .setFooter(footner_name, footer_icon);

  return embed
}

module.exports = {
  buildNewEmbed
}