module.exports = (client, interaction) => {
  //console.log(interaction)
  // The interaction is a slash command
	if (interaction.isCommand()) {
    client.emit('slashCreate', interaction);
  }
}