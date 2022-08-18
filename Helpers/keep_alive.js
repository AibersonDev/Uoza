var http = require('http');

var port = process.env.PORT || 8080;

http.createServer(function (req, res) {
  res.write(`I'm alive`);
  res.end();
}).listen(8080);

const fetch = require('node-fetch');

setInterval(() => {
  fetch('https://together-forever-tsukasita.glitch.me/')//.then(() => console.log('ping'));
  fetch('http://lavalinkserver1.herokuapp.com');
  fetch('https://lavalink-repl.aiberson.repl.co');
  fetch('http://lavalink-repl.aiberson.repl.co');
  //fetch('https://lavalink-repl3.aiberson.repl.co');
  //fetch('http://lavalink-repl3.aiberson.repl.co');
  /*fetch('https://lavalink-repl.aiberson.repl.co');
  fetch('http://lavalink-repl.aiberson.repl.co');*/
  fetch('https://lavalink-repl2.aiberson.repl.co');
  fetch('http://lavalink-repl2.aiberson.repl.co');
}, 10000)