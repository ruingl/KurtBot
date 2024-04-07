const fs = require('fs-extra');
const path = require('path');
const logger = require('./kurt/logger');

async function loadAll() {
  const commandPath = path.join(
    __dirname, 'modules', 'cmds'
  );
  const eventPath = path.join(
    __dirname, 'modules', 'events'
  );

  try {
    const commandFiles = fs
      .readdirSync(commandPath)
      .filter((file) => file.endsWith(".js"));
    const eventFiles = fs
      .readdirSync(eventPath)
      .filter((file) => file.endsWith(".js"));

    commandFiles.forEach((file) => {
      try {
        const commandFile = require(file);

        if (!commandFile) {
          logger.error(`Command file: ${file} does not export anything!`);
        } else if (!commandFile.config) {
          logger.error(`Command file: ${file} does not export config!`);
        } else if (!commandFile.run) {
          logger.error(`Command file: ${file} does not export run!`);
        } else {
          global.client.commands.set(
            commandFile.config.name, commandFile
          );
        };
      } catch (error) {
        logger.error(`Error while loading command file: ${file}, ${error}`);
      }
    });
    
    eventFiles.forEach((file) => {
      try {
        const eventFile = require(file);

        if (!eventFile) {
          logger.error(`Event file: ${file} does not export anything!`);
        } else if (!eventFile.config) {
          logger.error(`Event file: ${file} does not export config!`);
        } else if (!eventFile.onEvent) {
          logger.error(`Event file: ${file} does not export onEvent!`);
        } else {
          global.client.events.set(
            eventFile.config.name, eventFile
          );
        };
      } catch (error) {
        logger.error(`Error while loading event file: ${file}, ${error}`);
      }
    });
  } catch (error) {
    logger.error(error);
  }
};

module.exports = { loadAll }