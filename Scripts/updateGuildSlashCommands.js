module.exports.run = async (client, guildId) => {
  let data = [];
  
  let _ = await client.loadInteractionGroup();
  if (Array.isArray(_)) data.push(..._);
  
  let guild = client.guilds.cache.get(/*client.supportServer*/guildId);

  try {
    await client.guilds.cache.get(/*client.supportServer*/guildId)?.commands.set(data);

    console.log('Loaded Interactions for guild: ' + guild.name);
    
    return 'complete';
  } catch (err) {
    console.error(`Failed to load interactions for guild: ${guild.id} due to: ${err.message}.`);
    
    return 'error';
  }
}