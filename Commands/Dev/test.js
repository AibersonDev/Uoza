const Discord = require('discord.js');

module.exports = {
  config: {
    name: 'test',
    description: 'a test',
    alias: [],
  },
  run: async (client, message, args) => {
    message.channel.send('It\'s Test');
  },
  slash: {
    callback: async (client, interaction, guild, args) => {
      let embed = new Discord.MessageEmbed()
      .setDescription('Aiberson')
      .setColor('RANDOM')
      .setImage(url);
      
      return interaction.reply({embeds: [embed]});
    }
  }
}