const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

async function baseApiUrl() {
  const res = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return res.data.mahmud;
}

async function getUIDByFullName(api, threadID, body) {
  const threadInfo = await api.getThreadInfo(threadID);
  const users = threadInfo.userInfo || [];

  let name = body.toLowerCase().trim();

  // remove @ if exists
  if (name.includes("@")) {
    const match = name.match(/@(.+)/);
    if (match) name = match[1];
  }

  name = name.replace(/\s+/g, " ");

  const user = users.find(u => {
    if (!u.name) return false;
    const fullName = u.name.toLowerCase().trim().replace(/\s+/g, " ");
    return fullName.includes(name);
  });

  return user ? user.id : null;
}

module.exports.config = {
  name: "jail2",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "MahMUD",
  description: "Jail effect (full mention detect)",
  commandCategory: "fun",
  usages: "[@mention/reply/UID/link/name]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
  if (module.exports.config.credits !== obfuscatedAuthor) {
    return api.sendMessage(
      "You are not authorized to change the author name.",
      threadID,
      messageID
    );
  }

  let targetID;

  try {
    // ===== 1. Reply =====
    if (event.type === "message_reply") {
      targetID = event.messageReply.senderID;
    }

    // ===== 2. Real Facebook Mention =====
    else if (Object.keys(event.mentions || {}).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    }

    // ===== 3. Facebook Profile Link =====
    else if (args[0]?.includes("facebook.com")) {
      targetID = await api.getUID(args[0]);
    }

    // ===== 4. UID =====
    else if (!isNaN(args[0])) {
      targetID = args[0];
    }

    // ===== 5. Name OR @name (Helper) =====
    else if (args.length > 0) {
      const input = args.join(" ");
      targetID = await getUIDByFullName(api, threadID, input);

      if (!targetID) {
        return api.sendMessage(
          "❌নাম দিয়ে কাউকে খুঁজে পাওয়া যায়নি 😕",
          threadID,
          messageID
        );
      }
    }

    // ===== No Input =====
    if (!targetID) {
      return api.sendMessage(
        "❌একজন কে মেনশন করো😗",
        threadID,
        messageID
      );
    }

    // ===== Please Wait =====
    const waitMsg = await api.sendMessage("⏳ Processing...", threadID);

    // ===== API Call =====
    const apiUrl = await baseApiUrl();
    const url = `${apiUrl}/api/dig?type=jail&user=${targetID}`;

    const response = await axios.get(url, {
      responseType: "arraybuffer"
    });

    const filePath = path.join(__dirname, "cache", `jail_${targetID}.png`);
    fs.writeFileSync(filePath, response.data);

    // ===== Remove wait msg =====
    try {
      await api.unsendMessage(waitMsg.messageID);
    } catch {}

    // ===== Get Name =====
    const userInfo = await api.getUserInfo(targetID);
    const name = userInfo[targetID]?.name || "User";

    // ===== Send Result =====
    const msg = await api.sendMessage(
      {
        body: `🚔 ${name} পোদ মারা খাইলি🐸`,
        mentions: [{ tag: name, id: targetID }],
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      messageID
    );

    // ===== Auto Delete (2 min) =====
    setTimeout(() => {
      try {
        api.unsendMessage(msg.messageID);
        fs.unlinkSync(filePath);
      } catch {}
    }, 120000);

  } catch (err) {
    console.error(err);
    return api.sendMessage(
      "🥹error, পরে আবার চেষ্টা করো...",
      threadID,
      messageID
    );
  }
};
