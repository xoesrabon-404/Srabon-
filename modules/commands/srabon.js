const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "sraboninfo",
  version: "1.2.0",
  hasPermission: 0,
  credits: "Srabon",
  description: "Srabon লিখলে ওনার ইনফো আসবে",
  commandCategory: "Info",
  usages: "Srabon",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const msg = body.toLowerCase();
  
  // 'srabon' বা 'শ্রাবন' লিখলে এটি ট্রিগার হবে
  if (msg.includes("srabon") || msg.includes("শ্রাবন") || msg.includes("শ্রাবণ")) {
    const imageUrl = "https://i.imgur.com/oI69KWy.jpeg";
    const path = __dirname + `/cache/srabon_${Date.now()}.png`;

    try {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(path, Buffer.from(response.data, "binary"));

      const infoMsg = `
🌟 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🌟
━━━━━━━━━━━━━━━
👑 𝗡𝗮𝗺𝗲: 𝐴ℎ𝑚𝑒𝑑 𝑆𝑟𝑎𝑏𝑜𝑛 ✨
📍 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: মেয়েদের মনে... 🙈
💼 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻: সবার মন জয় করা 😍

🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: আইডি বেইচ্চা খাইয়া লাইছি! 😁
💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿: দিলে হবু বউ মারবে... 😌
📸 𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺: গরিব বলে ফেসবুক চালাই শুধু! 🥺
📱 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: দিলে আম্মু বকা দিবে... 🤣
🎵 𝗧𝗶𝗸𝗧𝒐𝗸: সরি, আমি প্রতিবন্ধী না! 🥱
👻 𝗦𝗻𝗮𝗽𝗰𝗵𝗮𝘁: তোদের মতো কালা নাকি? 🤭

━━━━━━━━━━━━━━━
🤖 𝗕𝗢𝗧 𝗕𝗬: 𝐒𝐑𝐀𝐁𝐎𝐍 𝐂𝐇𝐀𝐓 𝐁𝐎𝐓 ⚡
      `;

      return api.sendMessage({
        body: infoMsg,
        attachment: fs.createReadStream(path)
      }, threadID, () => {
        if (fs.existsSync(path)) fs.unlinkSync(path);
      }, messageID);

    } catch (error) {
      console.error(error);
    }
  }
};

module.exports.run = async function ({ api, event }) {
  // .sraboninfo লিখলেও যাতে কাজ করে
  return this.handleEvent({ api, event });
};
