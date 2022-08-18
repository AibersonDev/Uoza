const Discord = require("discord.js");
const setupSchema = require('../../Models/Setups.js');

module.exports = {
  config: {
    name: "setup-r",
    alias: ["sr"],
    category: 'Developer',
  },
  run: async (client, message, args) => {
    var contador = 0;
        var finalizado = false;

        var objeto = {
            ID_MENSAJE: "",
            ID_CANAL: "",
            Parametros: []
        }

        emoji()
        async function emoji(){
            contador++;
            if(contador === 23) return finalizar();
            var parametros = {
                Emoji: "",
                Emojimsg: "",
                Rol: "",
                msg: "",
            };

            let preguntar = await message.reply({
                embeds: [new Discord.MessageEmbed()
                .setTitle(`¿Qué emoji quieres usar para el \`${contador}º\` rol?`)
                .setDescription(`*Reacciona en **__este mensaje__** con el emoji deseado!*\n\nEscribe \`finalizar\` para terminar el setup!`)
                .setColor(client.color)
            ]
            });
            preguntar.awaitReactions({
                filter: (reaction, user) => {
                    return user.id === message.author.id && !finalizado;
                },
                max: 1,
                errors: ["time"],
                time: 180e3
            }).then(collected => {
                if(collected.first().emoji.id && collected.first().emoji.id.length > 2){
                    preguntar.delete();
                    parametros.Emoji = collected.first().emoji.id;
                    if(collected.first().emoji.animated){
                        parametros.Emoji = `<a:${collected.first().emoji.id}>`
                    } else {
                        parametros.Emoji = `<:${collected.first().emoji.id}>`
                    }
                    return rol()
                } else if(collected.first().emoji.name){
                    preguntar.delete();
                    parametros.Emoji = collected.first().emoji.name;
                    parametros.Emojimsg = collected.first().emoji.name;
                    return rol();
                } else {
                    message.reply(`Cancelado y finalizando setup...`)
                    return finalizar();
                }
            }).catch(() => {
                return finalizar();
            });

            preguntar.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                errors: ["time"],
                time: 180e3
            }).then(collected => {
                if(collected.first().content.toLowerCase() === "finalizar" && !finalizado){
                    finalizado = true;
                    return finalizar();
                }
            }).catch(() => {
                return finalizar();
            });

            async function rol(){
                let querol = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                    .setTitle(`¿Qué rol quieres usar para el emoji seleccionado?`)
                    .setDescription(`*Simplemente menciona el rol o escribe su ID!*`)
                    .setColor(client.color)
                    ]
                });
                await querol.channel.awaitMessages({
                    filter: m => m.author.id === message.author.id,
                    max: 1,
                    errors: ["time"],
                    time: 180e3
                }).then(async collected => {
                    var message = collected.first();
                    const rol = message.guild.roles.cache.get(message.content) || message.mentions.roles.filter(r => r.guild.id == message.guild.id).first();
                    if(rol) {
                        parametros.Rol = rol.id;
                        objeto.Parametros.push(parametros);

                        querol.delete().catch(() => {});

                        return emoji();
                    } else {
                        return message.reply(`❌ **El Rol que has mencionado NO EXISTE!**\nSetup cancelado!`)
                    }
                }).catch(() => {
                    return finalizar();
                })
            }
        }

        async function finalizar() {
            if(contador === 1 && !objeto.Parametros.length) return message.reply(`❌ **Tienes que añadir al menos un emoji con un rol**\nSetup cancelado!`);
            let msg = await message.reply({
                embeds: [new Discord.MessageEmbed()
                .setTitle(`Especificar Canal`)
                .setDescription(`⬇ Menciona o escribe la ID del canal del mensaje a reaccionar! ⬇`)
                .setColor(client.color)
                ]
            })
            await msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                errors: ["time"],
                time: 180e3,
            }).then(async collected => {
                var message = collected.first();
                const canal = message.guild.channels.cache.get(message.content) || message.mentions.channels.filter(c => c.guild.id == message.guild.id).first()
                if(canal) {
                    objeto.ID_CANAL = canal.id

                    var idmensaje = await message.reply({
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(`Especificar Mensaje`)
                            .setDescription(`⬇ Escribe la ID del mensaje para añadir las reacciones! ⬇`)
                            .setColor(client.color)
                        ]
                    });
                    await idmensaje.channel.awaitMessages({
                        filter: m => m.author.id === message.author.id,
                        max: 1,
                        errors: ["time"],
                        time: 180e3,
                    }).then(async collected => {
                        var message = collected.first();
                        const encontrado = await message.guild.channels.cache.get(objeto.ID_CANAL).messages.fetch(message.content);
                        if(encontrado){
                            for(var i = 0; i < objeto.Parametros.length; i++){
                                encontrado.react(objeto.Parametros[i].Emoji).catch(() => {console.log("NO SE HA PODIDO AÑADIR LA REACCIÓN")})
                            }
                            objeto.ID_MENSAJE = message.content;
                            let setupdatos = await setupSchema.findOne({guildID: message.guild.id});
                            setupdatos.reactionRoles.push(objeto);
                            setupdatos.save();
                            return message.reply(`Setup de Reacción con Roles Creado ✅\nPuedes crear otro setup ejecutando el comando \`u.sr\``)
                        } else {
                            return message.reply(`❌ **No se ha encontrado el mensaje que has especificado!**\nSetup cancelado!`)
                        }
                    }).catch((e) => {
                      console.log(e)
                        return message.reply(`Tu tiempo ha expirado!`)
                    })
                } else {
                    return message.reply(`❌ **No se ha encontrado el canal que has especificado!**\nSetup cancelado!`)
                }
            }).catch((e) => {
              console.log(e)
                return message.reply(`Tu tiempo ha expirado!`)
            })
        }

    /*let contador = 0;
    let finalizado = false;

    let obj = {
      ID_MESSAGE: '',
      ID_CHANNEL: '',
      Params: []
    };

    emoji();
    async function emoji() {
      contador++;
      if (contador === 23) return finalize();
      let params = {
        Emoji: '',
        Emojimsg: '',
        Role: '',
        Msg: ''
      };

      let question = await message.reply({
        embeds: [new MessageEmbed()
          .setTitle(`¿Qué emoji quieres usar para el \`${contador}\` rol?`)
          .setDescription(`*Reacciona en **__este mensaje__** con el emoji deseado!*\n\nEscribe \`finalizar\` para terminar el setup!`)
          .setColor(client.config.color)
        ]
      });
      question.awaitReactions({
        filter: (reaction, user) => {
          return user.id === message.author.id && !finalizado;
        },
        max: 1,
        errors: ['time'],
        time: 180e3
      }).then((collected) => {
        if (collected.first().emoji.id && collected.first().emoji.id.length > 2) {
          question.delete();
          params.Emoji = collected.first().emoji.id;
          if (collected.first().emoji.animated) {
            params.Emoji = `<a:${collected.first().emoji.id}>`
          } else {
            params.Emoji = `<:${collected.first().emoji.id}>`
          }
          return rol();
        } else if (collected.first().emoji.name) {
          question.delete();
          params.Emoji = collected.first().emoji.name;
          params.Emojimsg = collected.first().emoji.name;
          return rol();
        } else {
          message.reply(`Cancelado y finalizando setup...`);
          return finalize();
        }
      }).catch((err) => {
        console.log(err)
        return finalize();
      });

      question.channel.awaitMessages({
        filter: m => m.author.id === message.author.id,
        max: 1,
        errors: ['time'],
        time: 180e3
      }).then((collected) => {
        if (collected.first().content.toLowerCase() === 'finalizar' && !finalizado) {
          finalizado = true;
          return finalize();
        }
      }).catch((err) => {
        console.log(err)
        return finalize();
      });

      async function rol() {
        let whatRole = await message.reply({
          embeds: [new MessageEmbed()
            .setTitle(`¿Qué rol quieres usar para el emoji seleccionado?`)
            .setDescription(`*Simplemente menciona el rol o escribe su ID!*`)
            .setColor(client.config.color)
          ]
        });

        await whatRole.channel.awaitMessages({
          filter: m => m.author.id === message.author.id,
          max: 1,
          errors: ['time'],
          time: 180e3
        }).then(async (collected) => {
          let message = collected.first();
          let role = message.guild.roles.cache.get(message.content) || message.mentions.roles.filter((r) => r.guild.id === message.guild.id).first();

          if (role) {
            params.Role = role.id;
            obj.Params.push(params);

            whatRole.delete().catch(() => {});

            return emoji();
          } else {
            return message.reply('❌ **El Rol que has mencionado NO EXISTE!**\nSetup cancelado!');
          }
        }).catch((err) => {
          console.log(err)
          return finalize();
        });
      }
    }

    async function finalize() {
      if (contador === 1 && !obj.Params.length) return message.reply(`❌ **Tienes que añadir al menos un emoji con un rol**\nSetup cancelado!`);
      let msg = await message.reply({
        embeds: [new MessageEmbed()
          .setTitle(`Especificar un canal`)
          .setDescription(`Menciona o escribe la ID del canal del mensaje a reaccionar!`)
          .setColor(client.config.color)
        ]
      });

      await msg.channel.awaitMessages({
        filter: m => m.author.id === message.author.id,
        max: 1,
        errors: ['time'],
        time: 180e3,
      }).then(async (collected) => {
        let message = collected.first();
        let channel = message.guild.channels.cache.get(message.content) || message.mentions.channels.filter((c) => c.guild.id === message.guild.id).first();

        if (channel) {
          obj.ID_CHANNEL = channel.id;

          let IDMessage = await message.reply({
            embeds: [new MessageEmbed()
              .setTitle(`Especificar Canal`)
              .setDescription(`Menciona o escribe la ID del mensaje para añadir las reacciones!`)
              .setColor(client.config.color)
            ]
          });

          await IDMessage.channel.awaitMessages({
            filter: m => m.author.id === message.author.id,
            max: 1,
            errors: ['time'],
            time: 180e3,
          }).then(async (collected) => {
            let message = collected.first();
            let found = await message.guild.channels.cache.get(obj.ID_CHANNEL).messages.fetch(message.content);

            if (found) {
              for (var i = 0; i < obj.Params.length; i++) {
                found.react(obj.Params[i].Emoji).catch(() => { console.log('NO SE HA PODIDO AÑADIR LA REACCIÓN') });
              }
              obj.ID_MESSAGE = message.content;

              let setupData = await setupSchema.findOne({ guildID: message.guild.id });
              setupData.reactionRoles.push(obj.ID_MESSAGE)
              setupData.save();

              return message.reply(`Setup de Reacción con Roles Creado ✅\nPuedes crear otro setup ejecutando el comando \`u.setup\``);
            } else {
              return message.reply(`❌ **No se ha encontrado el mensaje que has especificado!**\nSetup Cancelado!`);
            }
          }).catch((err) => {
            console.log(err)
            return message.reply('Tu tiempo ha expirado');
          });
        } else {
          return message.reply(`❌ **No se ha encontrado el canal que has especificado!**\nSetup cancelado!`)
        }
      }).catch((e) => {
        return message.reply(`Tu tiempo ha expirado!`)
      })
    }*/
  }
}