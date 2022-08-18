const { readdirSync } = require('fs');
const { MessageEmbed } = require('discord.js');
const ascii = require('ascii-table');

let table = new ascii('Commands');
table.setHeading('Command', 'Load status');

module.exports = async (client) => {
  const load = (dirs) => {
    const commandDirs = readdirSync(`./Commands/${dirs}/`).filter(d => d.endsWith('.js'));
    
    for (let file of commandDirs) {
      let command = require(`../Commands/${dirs}/${file}`);
      
      client.commands.set(command.config.name, command);
      if (command.config.name) {
        table.addRow(file, '✅');
      } else {
        table.addRow(file, `❌  -> The name property is missing or not a string.`);
        continue;
      }
    };
  }; 
  
  [
    "Dev",
    "Information"
  ].forEach(x => load(x));
 
  console.log(table.toString());
};