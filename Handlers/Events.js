const { readdirSync } = require("fs")

module.exports = (client) => {
  const load = (dir) => {
    const events = readdirSync(`./Events/${dir}/`).filter(d => d.endsWith('.js'));
    
    for (let file of events) {
      const evt = require(`../Events/${dir}/${file}`);
      const eName = file.split('.')[0];
    
      client.on(eName, evt.bind(null, client));
    };
  };
  ["Client", "Servers"].forEach((x) => load(x));
};