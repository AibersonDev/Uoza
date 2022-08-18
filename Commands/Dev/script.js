const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { inspect } = require('util');

module.exports = {
  config: {
    name: "script",
    alias: ['scripts'],
    category: 'Developer',
    devsOnly: true
  },
  run: async (client, message, args, language) => {
    let scripts = fs.readdirSync('./Scripts');
    
    if (!args[0]) {
      let embed = new MessageEmbed()
      .setTitle('Available scripts:')
			.setDescription(scripts.map((c, i) => `${i + 1}.) ${c.replace('.js', '')}`).join('\n'));
      
      return message.reply({ embeds: [embed] });
    }
    
    if (scripts.includes(`${args[0]}.js`)) {
      try {
        let resp = await require(`../../Scripts/${args[0]}.js`).run(client, message.guild.id);
        return message.reply({embeds: [new MessageEmbed().setDescription('```js\n' + `${inspect(resp).substring(0, 1990)}` + '```').setColor(client.config.color)]});
      } catch (err) {
        console.error(`Command: 'script' has error: ${err.message}.`);
        return message.reply(`The following error has occurred: \`\`\`js\n${err}\n\`\`\``);
      }
    } else {
      message.reply('Invalid script name.');
    }
  }
}