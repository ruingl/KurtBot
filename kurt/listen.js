module.exports = async function(api, event) {
  const logger = require('./logger');
  const fonts = require('./handle/createFonts');
  const handleCommand = require('./handle/handleCommand');

  const message = {
    reply: (msg) => {
      return new Promise((res) => {
        api.sendMessage(
          msg,
          event.threadID,
          (_, info) => res(info),
          event.messageID
        );
      });
    },
    react: (emoji) => {
      api.setMessageReaction(emoji, event.messageID, () => {}, true);
    },
    add: (uid) => {
      api.addUserToGroup(uid, event.threadID);
    },
    kick: (uid) => {
      api.removeUserFromGroup(uid, event.threadID);
    },
    send: (msg) => {
      return new Promise((res) => {
        api.sendMessage(msg, event.threadID, (_, info) => res(info));
      });
    },
  };

  switch (event.type) {
    case 'message':
      handleCommand(
        api, event, message, fonts, logger
      );
      break;
    case 'event':
      handleEvent(
        api, event, message, fonts, logger
      );
      break;
  }
};