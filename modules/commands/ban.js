const fs = require("fs-extra");

module.exports.config = {
  name: "ban",
  version: "2.0.6",
  hasPermssion: 0,
  credits: "rX + Modified by Jihad",
  description: "Permanently ban members from the group",
  commandCategory: "group",
  usages: "[tag/reply] [reason]",
  cooldowns: 5
};

const OWNER_UIDS = [
  "100089997213872",
  "100086331559699"
];

module.exports.run = async function ({ api, args, event }) {
  const { threadID, messageID, senderID } = event;

  const info = await api.getThreadInfo(threadID);

  // BOT MUST BE ADMIN
  if (!info.adminIDs.some(i => i.id == api.getCurrentUserID())) {
    return api.sendMessage(
`━━━━━━━━━━━━━━━━━━━━━━━
 🚫🚫 ⏤͟͟͞͞𝐴𝐶𝐶𝐸𝑆𝑆 ⏤͟͟͞͞𝐷𝐸𝑁𝐼𝐸𝑆 🚫🚫
━━━━━━━━━━━━━━━━━━━━━━━

❌ 𝑆𝑖𝑟 𝐴𝑚𝑖 𝐺𝑟𝑜𝑢𝑝 𝐴𝑑𝑚𝑖𝑛 𝑛𝑎 
⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝐴𝑑𝑑 𝑀𝑒 𝐴𝑠 𝐴𝑑𝑚𝑖𝑛

━━━━━━━━━━━━━━━━━━━━━━━`,
      threadID,
      messageID
    );
  }

  // ONLY GROUP ADMIN OR BOT ADMIN
  if (
    !info.adminIDs.some(i => i.id == senderID) &&
    !(global.config.ADMINBOT || []).includes(senderID)
  ) {
    return api.sendMessage(
`━━━━━━━━━━━━━━━━━━━━━━━
 🚫🚫 ⏤͟͟͞͞𝐴𝐶𝐶𝐸𝑆𝑆 ⏤͟͟͞͞𝐷𝐸⃢𝑁𝐼𝐸𝐷 🚫🚫
━━━━━━━━━━━━━━━━━━━━━━━

❌ ⏤͟͟͞͞𝑌𝑂𝑈 𝐴𝑅𝐸 𝑁𝑂𝑇 𝐴𝑁 𝐴𝐷𝑀𝐼𝑁
⚠️ ⏤͟͟͞͞𝑌𝑂𝑈 𝐶𝐴𝑁𝑁𝑂𝑇 𝑅𝐸𝑀𝑂𝑉𝐸 𝐴𝑁𝑌𝑂𝑁𝐸
𝐹𝑅𝑂𝑀 𝑇𝐻𝐼𝑆 𝐺𝑅𝑂𝑈𝑃 𝑈𝑆𝐼𝑁𝐺 𝑇𝐻𝐸 𝐵𝑂𝑇

━━━━━━━━━━━━━━━━━━━━━━━`,
      threadID,
      messageID
    );
  }

  // GET TARGET USER ID
  let targetID;
  if (event.type === "message_reply") {
    targetID = event.messageReply.senderID;
  } else if (Object.keys(event.mentions).length > 0) {
    targetID = Object.keys(event.mentions)[0];
  } else {
    return api.sendMessage("❌ Please tag or reply to a user", threadID, messageID);
  }

  // OWNER PROTECTION
  if (OWNER_UIDS.includes(targetID)) {
    return api.sendMessage(
`━━━━━━━━━━━━━━━━━━━━━━━
 🚫🚫 𝐴𝐶𝐶𝐸𝑆𝑆 𝐷𝐸𝑁𝐼𝐸𝐷 🚫🚫
━━━━━━━━━━━━━━━━━━━━━━━

👑 ⏤͟͟͞͞𝐽𝐼𝐻𝐴𝐷 𝐼𝑆 𝑀𝑌 𝑂𝑊𝑁𝐸𝑅 ᜊ
💌 ⏤͟͟͞͞𝐻𝐸 𝐼𝑆 𝑀𝑌 𝐷𝐸𝑉𝐸𝐿𝑂𝑃𝐸𝑅 ღ
🤖 ⏤͟͟͞͞𝑆𝑌𝑆𝑇𝐸𝑀 𝑃𝑅𝑂𝑇𝐸𝐶𝑇𝐼𝑂𝑁 𝐸𝑁𝐴𝐵𝐿𝐸𝐷 ♡

❌ ⏤͟͟͞͞𝑌𝑂𝑈 𝐴𝑅𝐸 𝑁𝑂𝑇 𝐴𝐿𝐿𝑂𝑊𝐸𝐷
𝑇𝑂 𝐵𝐴𝑁 𝑂𝑅 𝐾𝐼𝐶𝐾 𝑇𝐻𝐼𝑆 𝑈𝑆𝐸𝑅 .

━━━━━━━━━━━━━━━━━━━━━━━`,
      threadID,
      messageID
    );
  }

  // ====== PERFECT REASON LOGIC ======
  let reason = "𝑁𝑜 𝑟𝑒𝑎𝑠𝑜𝑛 𝑤𝑎𝑠 𝑔𝑖𝑣𝑒𝑛";

  if (args.length > 0) {
    let fullText = args.join(" ");

    // REMOVE ALL MENTION TEXT
    for (const mentionText of Object.values(event.mentions || {})) {
      fullText = fullText.replace(mentionText, "");
    }

    fullText = fullText.replace(/\s+/g, " ").trim();
    if (fullText) reason = fullText;
  }

  // USER INFO
  const userInfo = await api.getUserInfo(targetID);
  const name = userInfo[targetID].name;

  const isBotAdmin = (global.config.ADMINBOT || []).includes(senderID);

  // SEND NOTICE FIRST
  await api.sendMessage(
`━━━━━━━━━━━━━━━━━━━━━━
 🚫 ⏤͟͟͞͞𝑃𝐸𝑅𝑀𝐴𝑁𝐸𝑁𝑇 ⏤͟͟͞͞𝐵𝐴𝑁  🚫
━━━━━━━━━━━━━━━━━━━━━
👤 ⏤͟͟͞͞𝑈𝑆𝐸𝑅 : ${name}
🆔 ⏤͟͟͞͞𝑈𝐼𝐷  : ${targetID}
📝 ⏤͟͟͞͞𝑅𝐸𝐴𝑆𝑂𝑁 : ${reason}
👮 ⏤͟͟͞͞𝐴𝐶𝑇𝐼𝑂𝑁 𝐵𝑌 : ${isBotAdmin ? "𝐵𝑂𝑇 𝐴𝐷𝑀𝐼𝑁" : "𝐺𝑅𝑂𝑈𝑃 𝐴𝐷𝑀𝐼𝑁"}
⚙️ ⏤͟͟͞͞𝑆𝑇𝐴𝑇𝑈𝑆 : 𝑅𝐸𝑀𝑂𝑉𝐼𝑁𝐺 𝐹𝑅𝑂𝑀 𝐺𝑅𝑂𝑈𝑃 𝐼𝑁 2 𝑆𝐸𝐶𝑂𝑁𝐷...
━━━━━━━━━━━━━━━━━━━━━━
━━━━━━━━━━━━━━━━━━━━━━`,
    threadID
  );

  // WAIT 2 SECONDS THEN KICK
  setTimeout(async () => {
    try {
      await api.removeUserFromGroup(targetID, threadID);
    } catch (err) {
      console.log("❌ Failed to remove user:", err);
    }
  }, 2000);
};
