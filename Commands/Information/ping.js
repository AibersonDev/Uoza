const Discord = require('discord.js');

module.exports = {
  config: {
    name: 'ping',
    alias: [],
  },
  run: async (client, message, args) => {
    let m = await message.channel.send({embeds: [new Discord.MessageEmbed().setDescription('pong').setColor(client.config.color)]});
    
    let embed = new Discord.MessageEmbed()
    .addField('Ping', `\`${m.createdTimestamp - message.createdTimestamp}ms\``, true)
    .addField('Client API', `\`${Math.round(client.ws.ping)}ms\``, true)
    .setColor(client.config.color)
    .setTimestamp();
      
    await m.edit({embeds: [embed]});
  }
}