module.exports = function ({ api, models }) {
  const fs = require("fs");
  const moment = require('moment-timezone');
  const config = require("./../config.json");

  const Users = require("./controllers/users")({ models, api }),
        Threads = require("./controllers/threads")({ models, api }),
        Currencies = require("./controllers/currencies")({ models });
  const logger = require("../utils/log.js");

  /////////////////////////////////////////////////////////////////////////////
  // NOTIFICATION HANDLER (যদি চালাতে চাও)
  setInterval(function () {
    if(global.config.NOTIFICATION) {	
      require("./handle/handleNotification.js")({ api });
    }
  }, 1000 * 60);

  /////////////////////////////////////////////////////////////////////////////
  // DATABASE LOADING
  (async function () {
    try {
      logger(global.getText('listen', 'startLoadEnvironment'), '[ DATABASE ]');
      let threads = await Threads.getAll(),
        users = await Users.getAll(['userID', 'name', 'data']),
        currencies = await Currencies.getAll(['userID']);

      for (const data of threads) {
        const idThread = String(data.threadID);
        global.data.allThreadID.push(idThread),
        global.data.threadData.set(idThread, data['data'] || {}),
        global.data.threadInfo.set(idThread, data.threadInfo || {});
      }

      for (const dataU of users) {
        const idUsers = String(dataU['userID']);
        global.data['allUserID']['push'](idUsers);
        if (dataU.name && dataU.name['length'] != 0) global.data.userName['set'](idUsers, dataU.name);
      }

      for (const dataC of currencies) global.data.allCurrenciesID.push(String(dataC['userID']));
    } catch (error) {
      return logger.loader(global.getText('listen', 'failLoadEnvironment', error), 'error');
    }
  }());

  /////////////////////////////////////////////////////////////////////////////
  // HANDLERS
  const handleCommand = require("./handle/handleCommand")({ api, models, Users, Threads, Currencies });
  const handleCommandEvent = require("./handle/handleCommandEvent")({ api, models, Users, Threads, Currencies });
  const handleReply = require("./handle/handleReply")({ api, models, Users, Threads, Currencies });
  const handleReaction = require("./handle/handleReaction")({ api, models, Users, Threads, Currencies });
  const handleEvent = require("./handle/handleEvent")({ api, models, Users, Threads, Currencies });
  const handleRefresh = require("./handle/handleRefresh")({ api, models, Users, Threads, Currencies });
  const handleCreateDatabase = require("./handle/handleCreateDatabase")({ api, Threads, Users, Currencies, models });

  /////////////////////////////////////////////////////////////////////////////
  // AUTO APPROVE / AUTO RENT
  const thuebotPath = process.cwd() + "/modules/commands/data/thuebot.json";

  const autoApprove = async (event) => {
    if (event.logMessageType === "log:subscribe") {
      const added = event.logMessageData.addedParticipants || [];
      const botAdded = added.some(i => i.userFbId == api.getCurrentUserID());

      if (botAdded) {
        let thuebot = [];
        try { thuebot = JSON.parse(fs.readFileSync(thuebotPath)); } catch {}

        if (!thuebot.find(t => t.t_id == event.threadID)) {
          thuebot.push({ t_id: event.threadID, time: Date.now() });
          fs.writeFileSync(thuebotPath, JSON.stringify(thuebot, null, 2));

          // Send only auto-approved confirmation (optional)
          api.sendMessage(
            "✅ Bot auto-approved. Everyone can now use commands.",
            event.threadID
          );
        }
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  // MAIN EVENT HANDLER
  return async (event) => {
    const { threadID, senderID, type } = event;
    const name = await Users.getNameUser(senderID);

    // AUTO APPROVE TRIGGER
    await autoApprove(event);

    // HANDLE COMMAND BLOCK (Old Rent Check)
    let prefix = (global.data.threadData.get(event.threadID) || {}).PREFIX || global.config.PREFIX;
    if ((event.body || '').startsWith(prefix) && event.senderID != api.getCurrentUserID()) {
      let thuebot;
      try { thuebot = JSON.parse(fs.readFileSync(thuebotPath)); } catch { thuebot = []; }
      let find_thuebot = thuebot.find($ => $.t_id == event.threadID);
      if (!find_thuebot && !global.config.ADMINBOT.includes(event.senderID)) {
        return api.sendMessage(
          `❎ Hi ${name}, this group has not rented the bot yet.`,
          event.threadID
        );
      }
    }

    // DATABASE & COMMAND HANDLER
    switch (type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        handleCreateDatabase({ event });
        handleCommand({ event });
        handleReply({ event });
        handleCommandEvent({ event });
        break;

      // OFF ALL NOTIFICATIONS
      case "event":
        handleEvent({ event });    // Still required for internal triggers, but no msg send
        handleRefresh({ event });
        break;

      case "message_reaction":
        handleReaction({ event });
        break;
    }
  };
};
