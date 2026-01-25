const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "owner",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Owner information command with rainbow styled border & picture",
  commandCategory: "Information",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const ownerInfo = 
`🌈═════════════════════🌈
         ✨ 𝑂𝑊𝑁𝐸𝑅 𝐼𝑁𝐹𝑂 ✨
🌈═════════════════════🌈

👤 𝑁𝑎𝑚𝑒       : 🌸 ⏤͟͟͞͞𝐽𝐼𝐻𝐴𝐷࿐ ❤️‍🩹🪽
🧸 𝑁𝑖𝑐𝑘 𝑁𝑎𝑚𝑒   : 💕 𝑃𝑙𝑎𝑦 𝑏𝑜𝑦
🎂 𝐴𝑔𝑒          : 🎉 18+
💘 𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛      : 💔 𝑆𝑖𝑛𝑔𝑙𝑒
🎓 𝑃𝑒𝑜𝑓𝑒𝑠𝑠𝑖𝑜𝑛  : 📚 𝑆𝑡𝑢𝑑𝑒𝑛𝑡
📚 𝐸𝑑𝑢𝑐𝑎𝑡𝑖𝑜𝑛   : 🏫 𝑆𝑆𝐶
🏡 𝐴𝑑𝑑𝑟𝑒𝑠𝑠   : 🏠 𝑀𝑖𝑟𝑝𝑢𝑟 1

🌈═════════════════════🌈
       🔗 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦
🌈═════════════════════🌈

📘 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 :  
👉 fb.com/100086599998655

💬 𝑀𝑒𝑠𝑠𝑔𝑒𝑛𝑒𝑟 :  
👉 m.me/100086599998655

📞 𝑊ℎ𝑎𝑡'𝑠 𝑎𝑝𝑝 :  
👉 wa.me/017798907511

✈️ 𝑇𝑙𝑒𝑔𝑟𝑎𝑚 :  
👉 t.me/01798907511

🌈═════════════════════🌈
        🌸 𝐸𝑛𝑑 🌸
🌈═════════════════════🌈`;

  const imageUrl = "https://i.imgur.com/VvguIxl.jpeg";

  return request(encodeURI(imageUrl))
    .pipe(fs.createWriteStream(__dirname + "/owner.jpg"))
    .on("close", () => {
      api.sendMessage(
        {
          body: ownerInfo,
          attachment: fs.createReadStream(__dirname + "/owner.jpg")
        },
        event.threadID,
        event.messageID
      );
    });
};
