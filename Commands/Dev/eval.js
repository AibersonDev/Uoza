const { MessageEmbed } = require("discord.js");

module.exports = {
  config: {
    name: "eval",
    alias: ["e"],
    category: 'Developer',
    devsOnly: true
  },
  run: async (client, message, args, language) => {
    let limit = 1950;
    try {
      var code = args.join(' ');
      let evalued = eval(code);
      if (typeof evalued !== "string")
      evalued = require("util").inspect(evalued, { depth: 0 })
      let txt = "" + evalued;
      if (txt.length > limit) {
        const embed = new MessageEmbed()
        .setAuthor({ name: "Evaluation done", iconURL: client.user.avatarURL() })
        .addField("Input", `\`\`\`js\n${code}\n\`\`\``)
        .addField("Output", `\`\`\`js\n ${txt.slice(0, limit)}\n\`\`\``)
        .setColor('#122881');
        
        message.channel.send({embeds: [embed]});
      } else {
        var embed = new MessageEmbed()
        .setAuthor({ name: "Evaluation done", iconURL: client.user.avatarURL() })
        .addField("Input", `\`\`\`js\n${code}\n\`\`\``)
        .addField("Output", `\`\`\`js\n ${txt}\n\`\`\``)
        .setColor("#122881")
        message.channel.send({embeds: [embed]});
      }
    } catch (err) {
      const embed = new MessageEmbed()
      .setAuthor({ name: "Evaluation failed", iconURL: client.user.avatarURL() })
      .addField("Input", `\`\`\`js\n${code}\n\`\`\``)
      .addField("Output", `\`\`\`js\n${err}\n\`\`\``)
      .setColor("#C23636")
      message.channel.send({embeds: [embed]});
    }
  }
}