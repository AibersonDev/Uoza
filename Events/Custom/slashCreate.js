const { Collection } = require('discord.js');

module.exports = async (client, interaction) => {
  //console.log(interaction);
  let guild = client.guilds.cache.get(interaction.guildId);
  let command = client.commands.get(interaction.commandName);
  let channel = guild.channels.cache.get(interaction.channelId);
  let member = guild.members.cache.get(interaction.user.id);
  
  if(!client.cooldowns.has(command)) {
    client.cooldowns.set(command, new Collection());
  }

  let now = Date.now();
  let timestamps = client.cooldowns.get(command);
  let cooldownAmount = (command.config.cooldown || 1) * 1000;

  if(timestamps.has(interaction.user.id)) {
    let expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if(now < expirationTime) {
      let timeLeft = (expirationTime - now) / 1000;
      return interaction.reply({ content: `Debe esperar ${timeLeft.toFixed(1)} segundos para volver a utilizar el comando **${command.config.name}**.`, ephemeral: true})
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
  
  try {
    await command.slash.callback(client, interaction, guild, interaction.options);
  } catch (err) {
    console.log(err);
  }
}