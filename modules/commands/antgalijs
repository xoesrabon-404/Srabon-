let antiGaliStatus = true; // Default ON

const badWords = [
  "কুত্তার বাচ্চা","মাগী","মাগীচোদ","চোদা","চুদ","চুদা","হোল","চুদির","ভোদা","মাং","চুদি",
  "চুতমারানি","মাদার চোদ","shawya","হেন্ডেল","বালের ছেলে","mal","মাগীর ছেলে","বানচোদ",
  "মারে চুদি","রান্দির ছেলে","বেশ্যা","বেশ্যাপনা","khanki","mgi","তোকে চুদি","fuck","mang","vuda",
  "mc","bc","xhudas","abal","fucking","motherfucker","putki","jawra","bot chudi","মায়ের",
  "vda","🖕","cdi","chudi","খানকি","magi","magir","magirchele","পুটকি","khankir pola"
];

module.exports.config = {
  name: "antigali",
  version: "5.2",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Anti Gali System | Admin Warning + User Kick",
  commandCategory: "moderation",
  usages: "!antigali on/off",
  cooldowns: 0
};

/* ================= BOX DESIGNS ================= */

// 🛡️ Admin Warning Box
const adminWarningBox = (name, uid) => `
╔══════════════════╗
   ⏤͟͟͞͞𝐴𝐷𝑀𝐼𝑁⃝ ⏤͟͟͞͞𝑁𝑂𝑇𝐼𝐶𝐸⃝
╚══════════════════╝

⏤͟͟͞͞𝑁𝐴𝑀𝐸 : ${name}
⏤͟͟͞͞𝑈𝐼𝐷   : ${uid}

🙏 ⏤͟͟͞͞𝑃𝐿𝑍 𝑆𝐼𝑅 
⏤͟͟͞͞𝑀𝐼𝑁𝐷 𝑌𝑂𝑈𝐸 𝐿𝐴𝑁𝐺𝑈𝐴𝐺𝐸 🙂

━━━━━━━━━━━━━━━━━━━━━━
 ⏤͟͟͟͟͞͞͞͞𝐴𝐷𝑀𝐼𝑁 ⏤͟͟͞͞𝐽𝐼𝐻𝐴𝐷 ⏤͟͟͞͞𝐻𝐴𝑆𝐴𝑁 ☻
━━━━━━━━━━━━━━━━━━━━━━
`;

// 🚫 Public Kick Box
const publicKickBox = (name, uid, reason) => `
╔════════════════════╗
   🚫 𝑈𝑆𝐸𝑅 𝐾𝐼𝐶𝐾𝐸𝐷  🚫
╚════════════════════╝

👤 𝑁𝐴𝑀𝐸   : ${name}
🆔 𝑈𝐼𝐷    : ${uid}
📛 𝑅𝐸𝐴𝑆𝑂𝑁 : ${reason}

━━━━━━━━━━━━━━━━━━━━━━
⏤͟͟͞͞𝐺𝑅𝑂𝑈𝑃 ⃝𝑅𝑈𝐿𝐸𝑆 𝑉𝐼𝑂𝐿𝐴𝑇𝐸𝐷⃠
━━━━━━━━━━━━━━━━━━━━━━
`;

/* ================= EVENT HANDLER ================= */

module.exports.handleEvent = async function ({ api, event, Threads }) {
  if (!antiGaliStatus || !event.body) return;

  const msg = event.body.toLowerCase();
  const threadID = event.threadID;
  const userID = event.senderID;
  const botID = api.getCurrentUserID();

  const detectedWord = badWords.find(w => msg.includes(w));
  if (!detectedWord) return;

  // User name
  let userName = "User";
  try {
    const info = await api.getUserInfo(userID);
    userName = info[userID]?.name || "User";
  } catch (e) {}

  // Thread info
  let threadInfo = {};
  try {
    threadInfo = Threads?.getData
      ? (await Threads.getData(threadID)).threadInfo
      : await api.getThreadInfo(threadID);
  } catch (e) {}

  const isAdmin = uid =>
    threadInfo.adminIDs?.some(a => (a.id || a) == uid) || false;

  const botIsAdmin = isAdmin(botID);
  const userIsAdmin = isAdmin(userID);

  // 🛡️ ADMIN → Warning only
  if (userIsAdmin) {
    await api.sendMessage(
      adminWarningBox(userName, userID),
      threadID
    );
    return;
  }

  // ❌ Bot admin না হলে কিছু করবে না
  if (!botIsAdmin) return;

  // 🧹 Auto delete abusive msg after 30 sec
  setTimeout(() => {
    api.unsendMessage(event.messageID).catch(() => {});
  }, 30000);

  // 🚫 Public kick notice
  await api.sendMessage(
    publicKickBox(
      userName,
      userID,
      "Abusive / Prohibited Language"
    ),
    threadID
  );

  // ⏱️ Kick after 1 sec
  setTimeout(async () => {
    try {
      await api.removeUserFromGroup(userID, threadID);
    } catch (e) {}
  }, 1000);
};

/* ================= COMMAND ================= */

module.exports.run = async function ({ api, event, args }) {
  if (!args[0]) {
    return api.sendMessage(
      "Usage: !antigali on / off",
      event.threadID
    );
  }

  if (args[0].toLowerCase() === "on") {
    antiGaliStatus = true;
    api.sendMessage(
      "🟢 Anti-Gali Enabled\nAdmin = Warning | User = Kick",
      event.threadID
    );
  } else if (args[0].toLowerCase() === "off") {
    antiGaliStatus = false;
    api.sendMessage(
      "🔴 Anti-Gali Disabled",
      event.threadID
    );
  }
};
