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
         ✨ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ✨
🌈═════════════════════🌈

👤 𝗡𝗮𝗺𝗲        : 🌸 JIHAD ❤️‍🩹🪽
🧸 𝗡𝗶𝗰𝗸 𝗡𝗮𝗺𝗲 : 💕 Play boy
🎂 𝗔𝗴𝗲          : 🎉 18+
💘 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻      : 💔 Single
🎓 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻   : 📚 Student
📚 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻    : 🏫 SSC
🏡 𝗔𝗱𝗱𝗿𝗲𝘀𝘀     : 🏠 Sava

🌈═════════════════════🌈
       🔗 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦
🌈═════════════════════🌈

📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 :  
👉 fb.com/100086599998655

💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿 :  
👉 m.me/100086599998655

📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 :  
👉 wa.me/017798907511

✈️ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 :  
👉 t.me/01798907511

🌈═════════════════════🌈
        🌸 𝗘𝗡𝗗 🌸
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
