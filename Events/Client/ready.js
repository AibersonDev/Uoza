module.exports = async (client) => {
  console.log(`Ready as ${client.user.tag}`);
  
  client.initDB();
  /*setInterval(() => {
    client.user.setPresence({
      status: 'dnd',
      activities: [{
        name: `Metras`,
        type: "PLAYING"
      }],
    });
  }, 5000);*/
}