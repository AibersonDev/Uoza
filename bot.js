//Ping of repl
const keep_alive = require("./Helpers/keep_alive.js");

//Code of discord bot
const UozaClient = require('./Structures/Client.js');
const client = new UozaClient();
require('dotenv').config();

["Commands", "Events"].forEach((x) => require(`./Handlers/${x}`)(client));

process.on("unhandledRejection", (err) => {
  let error = err.stack;
  console.log("Uncaught Promise error: \n" + error);
});

client.login(process.env.TOKEN);