const mongoose = require('mongoose');

const setupSchema = new mongoose.Schema({
  guildID: String,
  reactionRoles: Array,
});

const model = mongoose.model('ConfigReactionRole', setupSchema);

module.exports = model;