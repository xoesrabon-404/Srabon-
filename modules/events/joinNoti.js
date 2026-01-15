const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "joinnoti",
  version: "4.3.1",
  credits: "rX Abdullah",
  eventType: ["log:subscribe"],
  description: "Custom welcome without image, bot approval message included"
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, logMessageData } = event;
  const added = logMessageData.addedParticipants?.[0];
  if (!added) return;

  const userID = added.userFbId;
  const botID = api.getCurrentUserID();

  // =============== CASE 1: BOT ADDED ===============
  if (userID == botID) {
    api.sendMessage(
      `｡ﾟ･｡･ﾟﾟ｡
ﾟ。⏤͟͟͞͞☻𝐺𝑅𝑂𝑈𝑃 𝐴𝑃𝑃𝑅𝑂𝑉𝐸ᥫ᭡꫞
　ﾟ･｡･⏤͟͟͞͞ღтнαηкѕ ƒσя υѕιηg ოҽ 🥵•˚ `,
      threadID
    );

    await api.changeNickname("⃝⏤͟͟͞͞𝐴𝐼 ⏤͟͟͞͞𝐴⃝𝑆𝑆𝐼𝑆𝑇𝐴𝑁𝑇☠︎", threadID, botID);
    return;
  }

  // =============== CASE 2: NORMAL USER ADDED ===============
  const userName = added.fullName;

  // শুধু সাধারণ টেক্সট মেসেজ, কোন ছবি বা ক্যানভাস নয়
};
