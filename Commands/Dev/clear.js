const Discord = require('discord.js');

module.exports = {
  config: {
    name: 'clear',
    description: 'clear',
    alias: [],
  },
  run: async (client, message, args) => {
    if(!message.member.permissions.has("MANAGE_MESSAGES")) {
      return message.reply('No tienes permisos para ejecutar este comando.');
    }
    
    let amount = args[0];
    if (amount) amount = parseInt(amount);
    
    if (!amount) return message.reply('Debe especificar la cantidad de mensajes a borrar.');
    if (isNaN(amount)) return message.reply('Ese no es un número válido.');
    if (amount > 100) return message.reply('La cantidad especificada es mayor a 100.');
    if (amount < 1) return message.reply('La cantidad especificada es mayor a 1.');
    
    message.channel.bulkDelete(amount).then(() => {
      message.channel.send(`¡Se han eliminado ${amount} mensajes!`).then((msg) => {
        setTimeout(() => {
          msg.delete({ timeout: 3000 })
        }, 3000)
      });
    });
  }
}