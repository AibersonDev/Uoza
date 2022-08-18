const { secureEverything } = require('../../Functions/index.js');
const setupSchema = require('../../Models/Setups.js');

module.exports = async (client, reaction, user) => {
  try {
    //Comprobaciones previas (Si el usuario que añade la reacción es un bot o no hay server return)
    if (user.bot || !reaction.message.guild) return;
    //Comprobaciones previas (Si la reacción es parcial, la guardamos)
    if (reaction.partial) await reaction.fetch().catch(() => { });
    //Comprobaciones previas (Si la el mensaje de la reacción es parcial, la guardamos)
    if (reaction.message && reaction.message.partial) await reaction.message.fetch();
    //Aseguramos la base de datos en caso de que no haya una
    await secureEverything(reaction.message.guild.id);
    //Cargamos la base de datos
    const setup = await setupSchema.findOne({ guildID: reaction.message.guild.id });
    const reaccionroles = setup.reactionRoles;
    //Comprobaciones previas (Si no hay un setup de reacciones, return)
    if (!reaccionroles || !reaccionroles.length || reaccionroles.length === 0 || reaccionroles === undefined || reaccionroles === null) return;
    //Hacemos un bucle entre todas las configuraciones de las reacciones
    for (let i = 0; i < reaccionroles.length; i++) {
        //Si la id del mensaje de la reacción coincide con una de la base de datos, continuamos
        if (reaction.message.id === reaccionroles[i].ID_MENSAJE) {
            let usuario = await reaction.message.guild.members.cache.get(user.id);
            let parametros = reaccionroles[i].Parametros;
            let rol;
            //Hacemos un bucle en los parámetros de la configuración de la reacción con roles encontrada
            for (let k = 0; k < parametros.length; k++) {
                //Si el emoji reaccionado tiene ID, significa que es personalizado (del servidor)
                if (reaction.emoji?.id == parametros[k].Emoji) {
                    try {
                        rol = parametros[k].Rol;
                        let role = reaction.message.guild.roles.cache.get(parametros[k].Rol);
                        //Si se ha encontrado el rol de la base de datos a dar en el servidor continuamos
                        if (role) {
                            //Si el rol a dar está por debajo de los roles del bot, le damos el rol
                            if (usuario.guild.me.roles.highest.rawPosition > role.position) {
                                await usuario.roles.add(rol).catch((e) => { e });
                                //Si no, entonces hacemos return respondiendo que el bot no tiene permisos
                            } else {
                                reaction.message.channel.send(`❌ **No tengo suficientes permisos para dar el rol!**\nAsegúrate de mi rol esté por encima del rol a dar!`).catch(() => { }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete()
                                    }, 3000);
                                });
                            }
                            //Si el rol no se ha encontrado en el servidor, significa que ha sido eliminado
                        } else {
                            reaction.message.channel.send(`❌ **Ese rol ha sido eliminado!**`).catch(() => { }).then(msg => {
                                setTimeout(() => {
                                    msg.delete()
                                }, 3000);
                            });
                        }
                    } catch (e) { console.log(e) }
                    //Si el emoji reaccionado no tiene ID, significa que es de Discord
                } else if (reaction.emoji?.name == parametros[k].Emoji) {
                    try {
                        rol = parametros[k].Rol;
                        let role = reaction.message.guild.roles.cache.get(parametros[k].Rol);
                        //Si se ha encontrado el rol de la base de datos a dar en el servidor continuamos
                        if (role) {
                            //Si el rol a dar está por debajo de los roles del bot, le damos el rol
                            if (usuario.guild.me.roles.highest.position > role.position) {
                                await usuario.roles.add(rol).catch((e) => { e });
                                //Si no, entonces hacemos return respondiendo que el bot no tiene permisos
                            } else {
                                reaction.message.channel.send(`❌ **No tengo suficientes permisos para dar el rol!**\nAsegúrate de mi rol esté por encima del rol a dar!`).catch(() => { }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete()
                                    }, 3000);
                                });
                            }
                            //Si el rol no se ha encontrado en el servidor, significa que ha sido eliminado
                        } else {
                            reaction.message.channel.send(`❌ **Ese rol ha sido eliminado!**`).catch(() => { }).then(msg => {
                                setTimeout(() => {
                                    msg.delete()
                                }, 3000);
                            });
                        }
                    } catch (e) { console.log(e) }
                } else {
                    continue;
                }
            }
        }
    }
} catch (e) {
    console.log(e)
}
  /*try {
    if (user.bot || !reaction.message.guild) return;
    if (reaction.partial) await reaction.fetch().catch(() => {});
    if (reaction.message && reaction.message.partial) await reaction.message.fetch()
    await secureEverything(reaction.message.guild.id);

    const setup = await setupSchema.findOne({ guildID: reaction.message.guild.id });
    const reactionRoles = setup.reactionRoles;

    if (!reactionRoles || !reactionRoles.length || reactionRoles.length === 0 || reactionRoles === undefined || reactionRoles === null) return;

    for (let i = 0; i < reactionRoles.length; i++) {
      if (reaction.message.id === reactionRoles[i].ID_MESSAGE) {
        let user = await reaction.message.guild.members.cache.get(user.id)
        let params = reactionRoles[i].Params;
        let role;

        for (let k = 0; k < params.length; k++) {
          if (reaction.emoji?.id == params[k].Emoji) {
            try {
              role = params[k].Role;
              let role_ = reaction.message.guild.roles.cache.get(params[k].Role);
              
              if (role_) {
                if (user.guild.members.me.roles.highest.rawPosition > role_.position) {
                  await user.roles.add(role).catch((err) => { console.log(err) });
                } else {
                  reaction.message.channel.send('❌ **No tengo suficientes permisos para dar el rol!**\nAsegúrese de que mi rol esté por encima del rol a dar!').catch((err) => {}).then((msg) => {
                    setTimeout(() => {
                      msg.delete();
                    }, 3000);
                  });
                }
              } else {
                reaction.message.channel.send('❌ **Ese rol ha sido eliminado!**').catch((err) => {}).then((msg) => {
                  setTimeout(() => {
                    msg.delete();
                  }, 3000);
                });
              }
            } catch (err) {
              console.log(err);
            }
          } else if (reaction.emoji?.name == params[k].Emoji) {
            try {
              role = params[k].Role;
              let role_ = reaction.message.guild.roles.cache.get(params[k].Role);
              
              if (role_) {
                if (user.guild.memers.me.roles.highest.rawPosition > role_.position) {
                  await user.roles.add(role).catch(() => {});
                } else {
                  reaction.message.channel.send('❌ **No tengo suficientes permisos para dar el rol!**\nAsegúrese de que mi rol esté por encima del rol a dar!').catch((err) => {}).then((msg) => {
                    setTimeout(() => {
                      msg.delete();
                    }, 3000);
                  });
                }
              } else {
                reaction.message.channel.send('❌ **Ese rol ha sido eliminado!**').catch((err) => {}).then((msg) => {
                  setTimeout(() => {
                    msg.delete();
                  }, 3000);
                });
              }
            } catch (err) {
              console.log(err);
            }
          } else {
            continue;
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }*/
}