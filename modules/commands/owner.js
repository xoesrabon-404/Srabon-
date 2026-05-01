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
`🌟 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🌟

👑 𝗡𝗮𝗺𝗲: AHMED SRABON 😘
😻 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: মেয়েদের মনে🙈
💼 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻: মেয়েদের মন জয় করা😍

🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: আইডি বেইচ্চা খাইয়া লাইছি😁
💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿: দিলে Future বউ ধইরা মারব😌
📺 𝗬𝗼𝘂𝗧𝘂𝗯𝗲: কবে YouTubal ছিলাম 😺
📸 𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺: গরিব বলে ফেসবুক চালাই শুধু 🥺
📱 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: দিলে আমার আম্মু বকা দিবা 🤣
👻 𝗦𝗻𝗮𝗽𝗰𝗵𝗮𝘁: তোদের মতো কালা নাকি ফিল্টার লাগামু🤭

🤖 𝗕𝗢𝗧 𝗕𝗬: 🔰 AHMED SRABON 🔰
`,

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
