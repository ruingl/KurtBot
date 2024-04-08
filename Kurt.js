const fs = require('fs-extra');
const figlet = require('figlet');
const chalk = require('chalk');
const logger = require('./kurt/logger');
const login = require('./kurt/login');

const config = fs.readJSONSync('./config.json');

global.client = {
  config: config,
  botPrefix: config.botPrefix,
  botAdmins: config.botAdmins,
  botName: config.botName,
  botOwner: config.botOwner,
  commands: new Map(),
  events: new Map(),
};

async function start() {
  const appState = fs.readJSONSync('./cookies.json');
  const utils = require('./utils');
  const { botName, botOwner } = global.client;

  figlet.text(
    'KurtBot', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    }, async (err, data) => {
      if (err) return logger.error(err);

      await utils.loadAll();

      console.log(chalk.cyan(data));
      console.log(chalk.blue('> Time: [ ' + new Date().toLocaleTimeString() + ' ]'));
      console.log(chalk.blue('> Bot: ' + botName));
      console.log(chalk.blue('> Owner: ' + botOwner));
      console.log();

      login({ appState }, (err, api) => {
        if (err) return logger.error(err);

        api.setOptions({
          forceLogin: config.fcaOptions.forceLogin,
          listenEvents: config.fcaOptions.listenEvents,
          logLevel: config.fcaOptions.logLevel,
          updatePresence: config.fcaOptions.updatePresence,
          selfListen: config.fcaOptions.selfListen,
          userAgent: config.fcaOptions.userAgent,
          online: config.fcaOptions.online,
          autoMarkDelivery: config.fcaOptions.autoMarkDelivery,
          autoMarkRead: config.fcaOptions.autoMarkRead
        });

        api.listen(async (err, event) => {
          const listen = require('./kurt/listen');
          if (err) return logger.error(err);
          
          listen(api, event);
        });
      });
    }
  );
}

start();