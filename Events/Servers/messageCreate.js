const { secureEverything } = require('../../Functions/index.js');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  await secureEverything(message.guild.id);

  let RegMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  let prefix = client.config.prefix;

  let prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\s*`);

  if(message.content.match(RegMention)) {
    message.channel.send(`Holaa. Soy Uoza y para saber mis comandos escribe: \`${prefix}help\``);
  }
  
  let usedPrefix = message.content.match(prefixRegex);
  usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];
  
  if(message.content.startsWith(client.user.toString()) && usedPrefix) {
    message.mentions.users.delete(client.user.id)
    message.mentions.members.delete(client.user.id)
  }
  if (!message.content.startsWith(usedPrefix)) return;

  let args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
  let commandName = args.shift().toLowerCase();

  let command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.config.alias && cmd.config.alias.includes(commandName));
  if(!command) return;

  if(command.config.devsOnly && !client.config.devs.includes(message.author.id)) {
    return;
  }
  
  try {
    command.run(client, message, args);
  } catch (err) {
    message.channel.send('Ha ocurrido un error.');
    
    console.log(err);
  }
}