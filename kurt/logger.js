const chalk = require('chalk');

const logger = {
  info: (msg) => {
    console.log(`ℹ️ | ${msg}`);
  },
  
  error: (err) => {
    console.log(chalk.red(`❌ | ${err}`));
  },

  warn: (msg) => {
    console.log(chalk.yellow(`⚠️ | ${msg}`));
  },

  success: (msg) => {
    console.err(chalk.green(`❌ | ${msg}`));
  },
};

module.exports = logger;