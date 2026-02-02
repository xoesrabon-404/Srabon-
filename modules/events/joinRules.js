const axios = require("axios");

module.exports.config = {
  name: "joinRulesEvent",
  eventType: ["log:subscribe"],
  version: "1.0.5",
  credits: "Jihad",
  description: "Welcome rules event for all groups with image & mention"
};

module.exports.run = async ({ event, api }) => {

  // 🏷️ গ্রুপের নাম
  let groupName = "এই গ্রুপ";
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    groupName = threadInfo.threadName || groupName;
  } catch (e) {}

  // 👥 নতুন মেম্বার
  const added = event.logMessageData?.addedParticipants || [];
  if (added.length === 0) return;

  // 🏷️ Mention data
  const mentions = [];
  const memberNames = added.map(u => {
    mentions.push({
      tag: `@${u.fullName}`,
      id: u.userFbId
    });
    return `@${u.fullName}`;
  }).join(", ");

  // 👑 যে এডমিন এড করেছে
  let adminName = "Admin";
  try {
    const adminInfo = await api.getUserInfo(event.author);
    adminName = adminInfo[event.author]?.name || adminName;
  } catch (e) {}

  // 🖼️ Welcome Image
  const imageURL = "https://i.imgur.com/z9up0OT.jpeg";
  let imgStream;
  try {
    imgStream = (await axios.get(imageURL, { responseType: "stream" })).data;
  } catch (e) {
    imgStream = null;
  }

  const message =
`🎉💜✨ 𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑇ℎ𝑒 𝐹𝑎𝑚𝑖𝑙𝑦 ✨💜🎉


 💌💜 হ্যালো সবাই 💜😊 
 
আমাদের নতুন মেসেঞ্জার গ্রুপে তোমাদের স্বাগতম! 🥰💫  
এখানেই হবে হাসি-খুশি 😄🎈, গল্পগুজব 💬🌀  
আর একে অপরের সঙ্গে ভাগাভাগি করার অসীম আনন্দ! 🌈💖

🎊 আসো বন্ধু হও 💞✿  
🎊 মজা করো 😜, গল্প শোনাও 🗣️✨  
🎊 একে অপরকে পরিবারের মত মনে রাখো 🤍💜

━━━━━━━━━━━━━━━━━━━

🌸🤲 𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢 𝐴𝑙𝑎𝑖𝑘𝑢𝑚 🤲🌸

🏷️ ⏤͟͟͞͞𝐺𝑟𝑜𝑢𝑝 𝑁𝑎𝑚𝑒 ${groupName}

🤍✨ ⏤͟͟͞͞𝑁𝑒𝑤 ⏤͟͟͞͞𝐌𝐞𝐦𝐛𝐞𝐫
➤ ${memberNames} 🎉🥰


👑 ⏤͟͟͟͟͞͞͞͞𝐴𝑑𝑑𝑎 𝐵𝑦 ${adminName} 💼✨  
𝐿𝑜𝑣𝑒 𝐹𝑜𝑟𝑒𝑣𝑒𝑟 🫶💞

𝑻𝒉𝒂𝒏𝒌 𝑭𝒐𝒓 𝑼𝒔𝒊𝒏𝒈 ⏤͟͟͞͞𝐉𝐢𝐡𝐚𝐝 ⏤͟͟͞͞𝐂𝐡𝐚𝐭 ⏤͟͟͞͞𝐁𝐨𝐭 `;

  return api.sendMessage(
    {
      body: message,
      mentions,
      attachment: imgStream ? imgStream : []
    },
    event.threadID
  );
};
