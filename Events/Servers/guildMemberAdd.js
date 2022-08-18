const Discord = require('discord.js');
const Canvas = require('canvas');
Canvas.registerFont('./Assets/Fonts/After_Disaster.ttf', { family: 'AfterDisaster' });
Canvas.registerFont('./Assets/Fonts/go3v2.ttf', { family: 'GoT' });
Canvas.registerFont('./Assets/Fonts/Forte.TTF', { family: 'Forte' });
Canvas.registerFont('./Assets/Fonts/Comicz.ttf', { family: 'CSMsBI' });

module.exports = async (client, member) => {
  let guild = client.guilds.cache.get('948617337446211585');
  let welcomeChannel = guild.channels.cache.get('982612051644022884');
  let welcomeRole = guild.roles.cache.get('999510670351532222');

  let welcomeCanvas = {};
  welcomeCanvas.create = Canvas.createCanvas(1024, 500);
  welcomeCanvas.context = welcomeCanvas.create.getContext('2d');
  welcomeCanvas.context.font = '70px CSMsBI';
  welcomeCanvas.context.fillStyle = '#ffffff';
  
  await Canvas.loadImage('./Assets/Img/background2.png').then(async (img) => {
    welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500);
    welcomeCanvas.context.fillText('Bienvenid@', 325, 360);
    welcomeCanvas.context.beginPath();
    welcomeCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
    welcomeCanvas.context.stroke();
    welcomeCanvas.context.fill();
  }).catch((err) => {
    console.log(err);
  });

  let canvas = welcomeCanvas;
  canvas.context.font = '40px CSMsBI';
  canvas.context.textAlign = 'center';
  canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410);
  canvas.context.font = '35px CSMsBI';
  canvas.context.fillText(`Pasatela Bien`, 505, 455);
  canvas.context.beginPath();
  canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
  canvas.context.closePath();
  canvas.context.clip();
  await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png', size: 1024 })).then(async (img) => {
    canvas.context.drawImage(img, 393, 47, 238, 238);
  });

  let att = new Discord.MessageAttachment(canvas.create.toBuffer(), `welcome-${member.id}.png`);

  try {
    member.roles.add(welcomeRole);
    welcomeChannel.send({ content: `:wave: ¡Hola ${member.toString()} a **${member.guild.name}**!`, files: [att] });
  } catch (err) {
    console.error(err);
  }
}