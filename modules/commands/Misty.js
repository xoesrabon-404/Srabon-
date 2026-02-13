const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "misty",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Show Misty Intro",
  commandCategory: "info",
  usages: ".misty",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {

  const callback = () => api.sendMessage({
    body: `
｡ﾟﾟ･｡･ﾟﾟ｡
 ﾟ。𝑴𝒚 𝑰𝒏𝒕𝒓𝒐»😇🎀
　 ﾟ･｡･

𝐍𝐚𝐦𝐞:» 𝐑𝐚𝐟𝐢𝐲𝐚 𝐣𝐚𝐧𝐧𝐚𝐭 𝐌𝐢𝐬𝐭𝐲 🐱🫀
𝐍𝐢𝐜𝐤𝐧𝐚𝐦𝐞:» 𝐌𝐢𝐬𝐭𝐲 𝐁𝐛𝐳 😗✨
𝐂𝐨𝐮𝐧𝐭𝐫𝐲:» 𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡 🤡
𝐇𝐨𝐦𝐞:» 𝐑𝐚𝐧𝐠𝐩𝐮𝐫
𝐃𝐢𝐬𝐭𝐫𝐢𝐜𝐭:» 𝐑𝐚𝐧𝐠𝐩𝐮𝐫 😌💗
𝐂𝐥𝐚𝐬𝐬:» 10 𝐩𝐢𝐜𝐜𝐢 😺😸
𝐀𝐠𝐞:» 16 🥲💔
𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩:» 𝐀𝐤𝐝𝐢𝐧 𝐡𝐨𝐢𝐛𝐨 🫠❤️‍🩹♡^᪲᪲᪲ 🎀
𝐁𝐢𝐫𝐭𝐡 𝐎𝐟 𝐃𝐚𝐲:» 1" 𝐎𝐜𝐭𝐨𝐛𝐞𝐫 😌🎉
𝐁𝐞𝐬𝐭 𝐅𝐧𝐝:» 𝐜𝐡𝐢𝐥𝐨 𝐛𝐮𝐭 𝐚𝐤𝐡𝐨𝐧 𝐧𝐚𝐢 😌❤️‍🩹
𝐅𝐯𝐭 𝐂𝐨𝐥𝐨𝐮𝐫:» 𝐛𝐥𝐚𝐜𝐤 😺🖤
𝐅𝐯𝐭 𝐌𝐚𝐧:» ^᪲᪲᪲𝐀𝐠𝐞 𝐜𝐡𝐢𝐥𝐨 𝐚𝐤𝐡𝐨𝐧 𝐧𝐚𝐢^᪲᪲᪲ 🎀🫶🏻
𝐅𝐯𝐭 𝐄𝐦𝐨𝐣𝐢:» 🙂😩😒🥲😌🤗👀🫶🏻🙃🫠😛☠️

🥲👍🏻 আর কিছু নাই যা ভাগ..! 😩🔪
    `,
    attachment: fs.createReadStream(__dirname + "/cache/misty.jpg")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/misty.jpg"));

  return request("https://i.imgur.com/hvq9Hqa.jpeg")
    .pipe(fs.createWriteStream(__dirname + "/cache/misty.jpg"))
    .on("close", () => callback());
};
