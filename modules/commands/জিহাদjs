const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
 name: "জিহাদ",
 version: "1.0.1",
 hasPermssion: 0,
 credits: "Raj",
 description: "Display bot owner's information",
 commandCategory: "Info",
 usages: "",
 cooldowns: 5,
 dependencies: {
   request: "",
   "fs-extra": "",
   axios: ""
 }
};

module.exports.run = async function ({ api, event }) {
 const imageUrl = "https://i.imgur.com/oI69KWy.jpeg";
 const path = __dirname + "/cache/owner.png";

 request(imageUrl)
 .pipe(fs.createWriteStream(path))
 .on("close", () => {
   api.sendMessage({
     body:
`   🌟 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🌟

👑 𝗡𝗮𝗺𝗲:♛ 𝐴ℎ𝑚𝑒𝑑 𝑆𝑟𝑎𝑏𝑜𝑛 ──😘😈🪼🩶🪽
😻 𝗔𝗱𝗱𝗿𝗲𝘀𝘀:ᰔᩚ মেয়েদের মনে___🙈
💼 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻:ᰔ মেয়েদের মন জয় করা___😍

🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸:ꔛ আইডি বেইচ্চা খাইয়া লাইছি__😁
💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿:🧸 দিলে Future বউ ধইরা মারব__😌
📺 𝗬𝗼𝘂𝗧𝘂𝗯𝗲:♡ কবে YouTubal ছিলাম__😺
📸 𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺:ᜊ গরিব বলে ফেসবুক চালাই শুধু__🥺
📱 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:✧ দিলে আমার আম্মু বকা দিবা__🤣
🎵 𝗧𝗶𝗸𝗧𝗼𝗸:❀ সরি আমি প্রতিবন্ধী না__🥱
👻 𝗦𝗻𝗮𝗽𝗰𝗵𝗮𝘁:☻ তোদের মতো কালা নাকি ফিল্টার লাগামু__🤭

🤖 𝗕𝗢𝗧 𝗕𝗬: ─⏤͟͟͟͟͟͟͟͟͟͟͟͟͟͟͟͟͞͞͞͞͞͞͞͞͞͞͞͞͞͞͞͞ᰔᩚ𝑆𝑟𝑎𝑏𝑜𝑛 𝐶ℎ𝑎𝑡 𝑏𝑜𝑡  ࿐
`,
     attachment: fs.createReadStream(path)
   }, event.threadID, () => fs.unlinkSync(path));
 });
};
