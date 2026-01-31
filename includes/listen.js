module.exports = function ({ api, models }) {
  const fs = require("fs");
  const moment = require('moment-timezone');
  const axios = require("axios");
  const config = require("./../config.json");

  const Users = require("./controllers/users")({ models, api }),
        Threads = require("./controllers/threads")({ models, api }),
        Currencies = require("./controllers/currencies")({ models });
  const logger = require("../utils/log.js");

  /////////////////////////////////////////////////////////////////////////////

  // NOTIFICATION HANDLER
  setInterval(function () {
    if(global.config.NOTIFICATION) {	
      require("./handle/handleNotification.js")({ api });
    }
  }, 1000 * 60);

  // CHECKTT: DAILY & WEEKLY TOP
  var day = moment.tz("Asia/Dhaka").day();
  const checkttDataPath = __dirname + '/../modules/commands/tt/';
  
  setInterval(async() => {
    const day_now = moment.tz("Asia/Dhaka").day();
    if (day != day_now) {
      day = day_now;
      const checkttData = fs.readdirSync(checkttDataPath);
      console.log('--> CHECKTT: New Day');
      
      checkttData.forEach(async(checkttFile) => {
        const checktt = JSON.parse(fs.readFileSync(checkttDataPath + checkttFile));
        let storage = [], count = 1;
        
        for (const item of checktt.day) {
            const userName = await Users.getNameUser(item.id) || 'Facebook User';
            const itemToPush = item;
            itemToPush.name = userName;
            storage.push(itemToPush);
        };
        
        storage.sort((a, b) => {
            if (a.count > b.count) return -1;
            else if (a.count < b.count) return 1;
            else return a.name.localeCompare(b.name);
        });

        const timechecktt = moment.tz('Asia/Dhaka').format('DD/MM/YYYY || HH:mm:ss'); 
        const footer = `\n────────────────────\n💬 Total messages: ${storage.reduce((a, b) => a + b.count, 0)}\n⏰ Time: ${timechecktt}\n✏️ Keep interacting to reach the top!`;    
        let checkttBody = '[ DAILY INTERACTION TOP ]\n────────────────────\n📝 Top 10 most active members yesterday:\n\n';
        
        checkttBody += storage.slice(0, 10).map(item => {
          return `${count++}. ${item.name} - 💬 ${item.count} messages`;
        }).join('\n');
        
        api.sendMessage(checkttBody + footer, checkttFile.replace('.json', ''), (err) => err ? console.log(err) : '');
 
        checktt.day.forEach(e => { e.count = 0; });
        checktt.time = day_now;
        fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));
      });

      if (day_now == 1) { // Monday
        console.log('--> CHECKTT: New Week');
        checkttData.forEach(async(checkttFile) => {
          const checktt = JSON.parse(fs.readFileSync(checkttDataPath + checkttFile));
          let storage = [], count = 1;
          for (const item of checktt.week) {
              const userName = await Users.getNameUser(item.id) || 'Facebook User';
              const itemToPush = item;
              itemToPush.name = userName;
              storage.push(itemToPush);
          };
          storage.sort((a, b) => {
              if (a.count > b.count) return -1;
              else if (a.count < b.count) return 1;
              else return a.name.localeCompare(b.name);
          });
          
          const tctt = moment.tz('Asia/Dhaka').format('DD/MM/YYYY || HH:mm:ss');
          const footerWeek = `\n────────────────────\n⏰ Time: ${tctt}\n✏️ Keep interacting to reach the top next week!`;    
          let checkttBody = '[ WEEKLY INTERACTION TOP ]\n────────────────────\n📝 Top 10 most active members this week:\n\n';
          checkttBody += storage.slice(0, 10).map(item => {
            return `${count++}. ${item.name} - 💬 ${item.count} messages`;
          }).join('\n');
          
          api.sendMessage(checkttBody + footerWeek, checkttFile.replace('.json', ''), (err) => err ? console.log(err) : '');
          checktt.week.forEach(e => { e.count = 0; });
          fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));
        });
      }
      global.client.sending_top = false;
    }
  }, 1000 * 10);

  //////////////////////////////////////////////////////////////////////
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
        if (data['data'] && data['data']['banned'] == !![])
          global.data.threadBanned.set(idThread, { 'reason': data['data']['reason'] || '', 'dateAdded': data['data']['dateAdded'] || '' });
        if (data['data'] && data['data']['commandBanned'] && data['data']['commandBanned']['length'] != 0)
          global['data']['commandBanned']['set'](idThread, data['data']['commandBanned']);
        if (data['data'] && data['data']['NSFW']) global['data']['threadAllowNSFW']['push'](idThread);
      }
      logger.loader(global.getText('listen', 'loadedEnvironmentThread'));
      for (const dataU of users) {
        const idUsers = String(dataU['userID']);
        global.data['allUserID']['push'](idUsers);
        if (dataU.name && dataU.name['length'] != 0) global.data.userName['set'](idUsers, dataU.name);
        if (dataU.data && dataU.data.banned == 1) global.data['userBanned']['set'](idUsers, {
          'reason': dataU['data']['reason'] || '', 'dateAdded': dataU['data']['dateAdded'] || ''
        });
        if (dataU['data'] && dataU.data['commandBanned'] && dataU['data']['commandBanned']['length'] != 0)
          global['data']['commandBanned']['set'](idUsers, dataU['data']['commandBanned']);
      }
      for (const dataC of currencies) global.data.allCurrenciesID.push(String(dataC['userID']));
    } catch (error) {
        return logger.loader(global.getText('listen', 'failLoadEnvironment', error), 'error');
    }
  }());
  
  const admin = config.ADMINBOT; 
  logger("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓", "[ SYSTEM ]");
  for(let i = 0; i <= admin.length -1; i++){
    let count = i + 1;
    logger(` ADMIN ID ${count}: ${(!admin[i]) ? "Empty" : admin[i]}`, "[ ADMIN ]");
  }
  logger(` BOT ID: ${api.getCurrentUserID()}`, "[ SYSTEM ]");
  logger(` PREFIX: ${global.config.PREFIX}`, "[ SYSTEM ]");
  logger(` BOT NAME: ${(!global.config.BOTNAME) ? "Maria Bot" : global.config.BOTNAME}`, "[ SYSTEM ]");
  logger("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛", "[ SYSTEM ]");

  const handleCommand = require("./handle/handleCommand")({ api, models, Users, Threads, Currencies });
  const handleCommandEvent = require("./handle/handleCommandEvent")({ api, models, Users, Threads, Currencies });
  const handleReply = require("./handle/handleReply")({ api, models, Users, Threads, Currencies });
  const handleReaction = require("./handle/handleReaction")({ api, models, Users, Threads, Currencies });
  const handleEvent = require("./handle/handleEvent")({ api, models, Users, Threads, Currencies });
  const handleRefresh = require("./handle/handleRefresh")({ api, models, Users, Threads, Currencies });
  const handleCreateDatabase = require("./handle/handleCreateDatabase")({  api, Threads, Users, Currencies, models });

  logger.loader(`Ping load source code: ${Date.now() - global.client.timeStart}ms`);

  /////////////////////////////////////////////////////////////////////////////
  // ==================== AUTO APPROVE / AUTO RENT ====================
  /////////////////////////////////////////////////////////////////////////////
  const thuebotPath = process.cwd() + "/modules/commands/data/thuebot.json";

  /////////////////////////////////////////////////////////////////////////////
  return async (event) => {
    const { threadID, senderID, type, logMessageType } = event;
    const name = await Users.getNameUser(senderID);

    // ORIGINAL HANDLERS
    switch (type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        handleCreateDatabase({ event });
        handleCommand({ event });
        handleReply({ event });
        handleCommandEvent({ event });
        break;
      case "event":
        handleEvent({ event });
        handleRefresh({ event });
        break;
      case "message_reaction":
        handleReaction({ event });
        break;
    }
  };
};mp) {
      try {
        var all = (await Threads.getInfo(el["TID"])).participantIDs;
        all.splice(all.indexOf(api.getCurrentUserID()), 1);
        var body = el.REASON || "HEY EVERYONE", mentions = [];
        for (let i = 0; i < all.length; i++) {
          if (i < body.length) mentions.push({ tag: body[i], id: all[i], fromIndex: i });
        }
        var out = { body, mentions };
        if (el.ATTACHMENT) {
          out.attachment = [];
          for (let a of el.ATTACHMENT) {
            let getAttachment = (await axios.get(encodeURI(a.url), { responseType: "arraybuffer"})).data;
            let path = __dirname + `/../modules/commands/cache/${a.fileName}`;
            fs.writeFileSync(path, Buffer.from(getAttachment, 'utf-8'));
            out.attachment.push(fs.createReadStream(path));
          }
        }
        if (el.BOX) await api.setTitle(el.BOX, el.TID);
        api.sendMessage(out, el.TID, () => {
          if (el.ATTACHMENT) el.ATTACHMENT.forEach(a => fs.unlinkSync(__dirname + `/../modules/commands/cache/${a.fileName}`));
        });
      } catch (e) { console.log(e); }
    }
  };
  setInterval(checkAndExecuteEvent, 60000);

  return async (event) => {
    const { threadID, author, image, type, logMessageType, logMessageBody, logMessageData } = event;
    const timeNow = moment().tz("Asia/Dhaka").format("HH:mm:ss || DD/MM/YYYY");
    var data_anti = JSON.parse(fs.readFileSync(global.anti, "utf8"));

    if (type == "change_thread_image") {
      var threadInf = await api.getThreadInfo(threadID);
      const findAd = threadInf.adminIDs.find((el) => el.id === author);
      const findAnti = data_anti.boximage.find(item => item.threadID === threadID);
      if (findAnti) {
        if (findAd || author == api.getCurrentUserID()) {
          findAnti.url = event.image.url;
          fs.writeFileSync(global.anti, JSON.stringify(data_anti, null, 4));
        } else {
          const res = await axios.get(findAnti.url, { responseType: "stream" });
          api.sendMessage(`⚠️ Anti-Group Image Change is active\n⏰ Time: ${timeNow}`, threadID);
          return api.changeGroupImage(res.data, threadID);
        }
      }
    }

    if (logMessageType === "log:thread-name") {
      var threadInf = await api.getThreadInfo(threadID);
      const findAd = threadInf.adminIDs.find((el) => el.id === author);
      const findAnti = data_anti.boxname.find(item => item.threadID === threadID);
      if (findAnti) {
        if (findAd || author == api.getCurrentUserID()) {
          findAnti.name = logMessageData.name;
          fs.writeFileSync(global.anti, JSON.stringify(data_anti, null, 4));
        } else {
          api.sendMessage(`⚠️ Anti-Group Name Change is active\n⏰ Time: ${timeNow}`, threadID);
          return api.setTitle(findAnti.name, threadID);
        }
      }
    }

    if (logMessageType === "log:user-nickname") {
      const findAnti = data_anti.antiNickname.find(item => item.threadID === threadID);
      if (findAnti && author != api.getCurrentUserID()) {
          api.sendMessage(`⚠️ Anti-Nickname Change is active\n⏰ Time: ${timeNow}`, threadID);
          return api.changeNickname(findAnti.data[logMessageData.participant_id] || "", threadID, logMessageData.participant_id);
      }
    }

    if (logMessageType === "log:unsubscribe") {
      const findAnti = data_anti.antiout[threadID] ? true : false;
      if (findAnti && author == logMessageData.leftParticipantFbId) {
          api.addUserToGroup(logMessageData.leftParticipantFbId, threadID, (error) => {
              let status = error ? "Failed" : "Success";
              api.sendMessage(`⚠️ Anti-Out enabled: User re-added\n🔰 Status: ${status}\n👤 User ID: ${logMessageData.leftParticipantFbId}\n⏰ Time: ${timeNow}`, threadID);
          });
      }
    }

    let prefix = (global.data.threadData.get(event.threadID) || {}).PREFIX || global.config.PREFIX;
    let name = await Users.getNameUser(event.senderID);
    
    if ((event.body || '').startsWith(prefix) && event.senderID != api.getCurrentUserID()) {
        let thuebot;
        try { thuebot = JSON.parse(fs.readFileSync(process.cwd() + '/modules/commands/data/thuebot.json')); } catch { thuebot = []; }
        let find_thuebot = thuebot.find($ => $.t_id == event.threadID);
        if (!find_thuebot && !global.config.ADMINBOT.includes(event.senderID)) {
            return api.sendMessage(`❎ Hi ${name}, this group has not rented the bot yet.`, event.threadID);
        }
    }

    var gio = moment.tz('Asia/Dhaka').format('DD/MM/YYYY || HH:mm:ss');
    var thu = moment.tz('Asia/Dhaka').format('dddd');

    if (event.type == "change_thread_image") api.sendMessage(`» [ ${global.config.BOTNAME} ] «\n» [ GROUP UPDATE ] «\n────────────────────\n📝 ${event.snippet}\n────────────────────\n⏰ Time: ${gio} || ${thu}`, event.threadID);

    switch (event.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        handleCreateDatabase({ event });
        handleCommand({ event });
        handleReply({ event });
        handleCommandEvent({ event });
        break;
      case "event":
        handleEvent({ event });
        handleRefresh({ event });
        if (event.type != "change_thread_image" && global.config.notiGroup) {
          let msg = `» [ ${global.config.BOTNAME} ] «\n» [ GROUP UPDATE ] «\n────────────────────\n📝 ${event.logMessageBody}\n────────────────────\n⏰ Time: ${gio} || ${thu}`;
          api.sendMessage(msg, event.threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5000));
            return api.unsendMessage(info.messageID);
          }); 
        }
        break;
      case "message_reaction":
        if(global.config.iconUnsend.status && event.senderID == api.getCurrentUserID() && event.reaction == global.config.iconUnsend.icon) {
          api.unsendMessage(event.messageID)
        }
        handleReaction({ event });
        break;
    }
  };
};
