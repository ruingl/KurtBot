module.exports = async function(api, event, message, fonts, logger) {
  const { events } = global.client;
  
  try {
    for (const { config, onEvent } of events.values()) {
      if (event && config.name) {
        const args = event.body?.split("");
        await onEvent({
          api,
          event,
          args,
          message,
          fonts,
          logger
        });
      }
    }
  } catch (error) {
    logger.error(error);
  }
}