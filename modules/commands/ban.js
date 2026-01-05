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
  "100086599998655",
  "100086331559699"
];

module.exports.run = async function ({ api, args, event }) {
  const { threadID, messageID, senderID } = event;

  const info = await api.getThreadInfo(threadID);

  // BOT MUST BE ADMIN
  if (!info.adminIDs.some(i => i.id == api.getCurrentUserID())) {
    return api.sendMessage(
`━━━━━━━━━━━━━━━━━━━━━━━
 🚫🚫 ACCESS DENIED 🚫🚫
━━━━━━━━━━━━━━━━━━━━━━━

❌ BOT IS NOT ADMIN
⚠️ PLEASE ADD BOT AS ADMIN

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
 🚫🚫 ACCESS DENIED 🚫🚫
━━━━━━━━━━━━━━━━━━━━━━━

❌ YOU ARE NOT AN ADMIN
⚠️ YOU CANNOT REMOVE ANYONE
FROM THIS GROUP USING THE BOT

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
 🚫🚫 ACCESS DENIED 🚫🚫
━━━━━━━━━━━━━━━━━━━━━━━

👑 JIHAD IS MY OWNER
💌 HE IS MY DEVELOPER 
🤖 SYSTEM PROTECTION ENABLED

❌ YOU ARE NOT ALLOWED
TO BAN OR KICK THIS USER .

━━━━━━━━━━━━━━━━━━━━━━━`,
      threadID,
      messageID
    );
  }

  // ====== PERFECT REASON LOGIC ======
  let reason = "No reason was given";

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
 🚫🚫  PERMANENT BAN  🚫🚫
━━━━━━━━━━━━━━━━━━━━━
👤 USER : ${name}

🆔 UID  : ${targetID}

📝 REASON : ${reason}

👮 ACTION BY : ${isBotAdmin ? "BOT ADMIN" : "GROUP ADMIN"}

⚙️ STATUS : REMOVING FROM GROUP IN 2 SECONDS...
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
