// শুধুমাত্র Messenger Group Join Link ব্লক করবে (https://m.me/j/Ab...)
const messengerGroupLinkRegex = /https?:\/\/m\.me\/j\/Ab[A-Za-z0-9_-]+/gi;

module.exports.config = {
  name: "antimessengerlink",
  version: "1.1",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Block Messenger group links with notice box then kick",
  commandCategory: "moderation",
  usages: "Auto active",
  cooldowns: 0
};

// ইংরেজি বক্স নোটিশ
const noticeBox = (uid) => `
╔═════════════════════╗
🚨 ⏤͟͟͞͞𝐿𝐼𝑁𝐾 ⏤͟͟͞͞𝐷𝐸𝐹𝐸𝐶𝑇𝐸𝐷

👤 𝑈𝑠𝑒𝑟𝑠 𝐼'𝐷 : ${uid}

🚫 𝐴𝑐𝑡𝑖𝑜𝑛 :𝐾𝑖𝑐𝑘𝑒𝑑 𝐹𝑟𝑜𝑚 𝐺𝑟𝑜𝑢𝑝𝑠
╚════════════════════╝
`;

module.exports.handleEvent = async function({ api, event }) {
  if (!event.body) return;

  const message = event.body;
  const threadID = event.threadID;
  const userID   = event.senderID;
  const botID    = api.getCurrentUserID();

  // শুধু m.me/j/ লিংক চেক করবে
  if (!messengerGroupLinkRegex.test(message)) return;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const botIsAdmin = threadInfo.adminIDs?.some(admin => admin.id === botID);
    const userIsAdmin = threadInfo.adminIDs?.some(admin => admin.id === userID);

    // বট এডমিন না হলে কিছু করবে না
    if (!botIsAdmin) return;

    // ইউজার এডমিন হলে কিছু করবে না
    if (userIsAdmin) return;

    // আগে নোটিশ বক্স পাঠাবে
    await api.sendMessage(noticeBox(userID), threadID);

    // ১ সেকেন্ড পর কিক
    setTimeout(async () => {
      try {
        await api.removeUserFromGroup(userID, threadID);
      } catch (e) {}

      // ৩ সেকেন্ড পর লিংক মেসেজ ডিলিট
      setTimeout(() => {
        api.unsendMessage(event.messageID).catch(() => {});
      }, 3000);
    }, 1000);

  } catch (error) {
    console.error("AntiMessengerLink Error:", error);
  }
};

// যদি কেউ কমান্ড দেয়
module.exports.run = async function({ api, event }) {
  api.sendMessage("✅ Anti Messenger Group Link system is always active.", event.threadID);
};
