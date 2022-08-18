const { Client, Collection, Options } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');

class UozaClient extends Client {
  constructor() {
    super({
      restTimeOffset: 0,
      intents: 32511,
      partials: ['GUILD_MEMBER', 'USER', 'MESSAGE', 'CHANNEL', 'REACTION'],
      ws: {
        properties: {
          browser: "Discord Android"
        }
      },
    });

    this.chalk = require('chalk');
    this.config = require('../config.js');
    this.commands = new Collection();
    this.cooldowns = new Collection();
  }

  initDB() {
    const dbOptions = {
      useNewUrlParser: true,
      autoIndex: false,
			connectTimeoutMS: 10000,
			family: 4,
			useUnifiedTopology: true,
    };
    
    mongoose.connect(this.config.mongodb, dbOptions);
    mongoose.Promise = global.Promise;
    
    mongoose.connection.on('connected', () => {
			console.log(this.chalk.greenBright('[DB Ready] Conectado a la Base de Datos MongoDB.'));
		});
		mongoose.connection.on('err', (err) => {
      console.log(this.chalk.red(`No se puede conectar a la base de datos MongoDB. Error: ${err}`));
		});
		mongoose.connection.on('disconnected', () => {
      console.log(this.chalk.yellow(`DB Desconectada.`));
		});
  }

  async loadInteractionGroup() {
    try {
      const arr = [];
      const commandDirs = fs.readdirSync('./Commands');

      for (const dir of commandDirs) {
        const commandFiles = fs.readdirSync(`./Commands/${dir}`).filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
          const command = require(`../Commands/${dir}/${file}`);
          if (command.slash) {
            const item = {
              name: command.config.name,
              description: command.config.description,
              defaultPermission: true
            };
            if (command.slash.options && command.slash.options[0]) {
              item.options = command.slash.options;
            }
            arr.push(item);
          }
        }
      }
      return arr;
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = UozaClient;