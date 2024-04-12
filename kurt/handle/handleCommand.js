module.exports = async function(api, event, message, fonts, logger) {
  const {
    botPrefix, botAdmins, commands
  } = global.client;

  try {
    let [command, ...args] = event.body
      .trim()
      .split(" ");

    if (command.startsWith(botPrefix)) {
      command = command.slice(botPrefix.length);
    }

    if (event.body.toLowerCase() === 'prefix') {
      message.reply(`KurtBot prefix: ${botPrefix}`);
    } else if (event.body) {
      const commandName = command && command.toLowerCase();
      const cmdFile = commands.get(command);

      if (cmdFile) {
        try {
          if (!botAdmins?.includes(event.senderID)) {
            message.reply('❌ | You are not allowed to use this command!');
          } else {
            if (cmdFile.config?.usePrefix !== false &&
              !event.body?.toLowerCase().startsWith(botPrefix)
            ) {
              await cmdFile.run(api, event, args, message, fonts, logger);
            } else if (
              cmdFile.config?.usePrefix === false &&
              event.body?.toLowerCase().startsWith(botPrefix)
            ) {
              message.reply('❌ | This command does not use prefixes!');
            } else if (
              cmdFile.config?.hasPrefix === false &&
              !event.body?.toLowerCase().startsWith(botPrefix)
            ) {
              message.reply('❌ | This command does not use prefixes!');
            } else {
              await cmdFile.run(api, event, args, message, fonts, logger);
            }
          }
        } catch (error) {
          logger.error(error.stack);
          message.reply(`❌ | ${error.message}
${error.stack}
${error.name}
${error.code}
${error.path}`);
        }
      }
    }
  } catch (error) {
    logger.error(error.stack);
    message.reply(`❌ | ${error.message}
${error.stack}
${error.name}
${error.code}
${error.path}`);
  }
};
