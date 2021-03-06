const { ipcMain } = require("electron");

module.exports.listen = function(channel, callback) {
  ipcMain.on(channel, async function(event, uuid, ...args) {
    try {
      const response = await callback(...args);
      event.sender.send(`${channel}_REPLY`, uuid, response);
    } catch (e) {
      event.sender.send(`${channel}_ERROR`, uuid, e);
    }
  });
};
