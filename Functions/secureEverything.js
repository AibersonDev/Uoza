const setupSchema = require('../Models/Setups.js');

async function secureEverything(guildID) {
  let setupsData = await setupSchema.findOne({ guildID: guildID });
  if (!setupsData) {
    console.log(`Asegurando: Setups`);
    
    setupsData = await new setupSchema({
      guildID: guildID,
      reactionRoles: [],
    });

    await setupsData.save();
  }
}

module.exports = secureEverything;