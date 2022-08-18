module.exports = {
  config: {
    name: 'updateslash',
    description: 'updateslash',
    alias: [],
  },
  run: async (client, message, args) => {
    let data = [];
    let guildId = message.guild.id;
  
    let _ = await client.loadInteractionGroup();
    if (Array.isArray(_)) data.push(..._);
    
    let guild = client.guilds.cache.get(/*client.supportServer*/guildId);

    try {
      await client.guilds.cache.get(/*client.supportServer*/guildId)?.commands.set(data);

      client.logger.log('Loaded Interactions for guild: ' + guild.name);
      
      return 'complete';
    } catch (err) {
      client.logger.error(`Failed to load interactions for guild: ${guild.id} due to: ${err.message}.`);
      
      return 'error';
    }
  }
}