const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
 name: "Intro",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "JIHAD ",
 description: "Show Owner Info",
 commandCategory: "info",
 usages: "Jihad",
 cooldowns: 2
};

module.exports.run = async function({ api, event }) {
 const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

 const callback = () => api.sendMessage({
 body: `
┌───────────────ᜊ        
│⏤͟͟͞͞𝐴⃠𝐷𝑀𝐼𝑁 ⏤͟͟͞͞𝐷𝑇𝐸𝐴𝐿𝐼𝑆                                
├───────────────ᥫ᭡
│  ⏤͟͟͞͞𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢 𝐴𝑙𝑎𝑖𝑘𝑢𝑚 ᥫ᭡
│
│ 💝 𝑁𝑎𝑚𝑒        : ⏤͟͟͞͞𝐴ℎ𝑚𝑒𝑑 𝑆𝑟𝑎𝑏𝑜𝑛 ᥫ᭡
│ 🌸 𝐺𝑒𝑛𝑑𝑒𝑟        : 𝑀𝑎𝑙𝑒 ᜊ
│ 💓 𝑅𝑒𝑎𝑙𝑎𝑡𝑖𝑜𝑛       : 𝑆𝑖𝑛𝑔𝑙𝑒 𝑃𝑟𝑜 𝑀𝑎𝑥 ෆ
│ 💋 𝐴𝑔𝑒          : 21+ ᰔᩚ
│ ❤️‍🔥 𝑅𝑒𝑙𝑖𝑔𝑖𝑜𝑛     : 𝐼𝑠𝑙𝑎𝑚 ♡
│ 🩷 𝐸𝑑𝑢𝑐𝑎𝑡𝑖𝑜𝑛      : 𝑚𝑜𝑛𝑒 𝑛ℎ𝑖 ლ
│ 💜 𝐴𝑑𝑑𝑟𝑒𝑠𝑠      : 𝐶𝑜𝑀𝐼𝐿𝐿𝐴  ᰔ
│ 🖤 𝐹𝑎𝑣𝑜𝑟𝑖𝑡𝑒 𝐶𝑜𝑙𝑜𝑟𝑠 : 𝑏𝑙𝑎𝑐𝑘 ɞ 
│ ♥️ 𝐻𝑒𝑖𝑔ℎ𝑡       : 5.8❥
│ ☠️ 𝑊𝑜𝑟𝑘         : 𝐻𝑎𝑐𝑘𝑖𝑛𝑔 ଓ
│
│    
│ 𝑀𝐸𝑆𝑆𝐴𝐺𝐸 𝐶𝐻𝐴𝑇 𝐵𝑂𝑇 ⏤͟͟͞͞𝐴𝐷𝑀𝐼𝑁
│
└───────────────ᥫ᭡          

┌───────────────ᥫ᭡
│ ⏤͟͟͞͞𝐶𝑂𝑁𝑇𝐴𝐶𝑇 ⏤͟͟͞͞𝐿𝐼𝑁𝐾
├───────────────ᜊ
│ 📘 ⏤͟͟͞͞𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘
│ facebook.com/100023401563213 ᜊ
│ 💬 ⏤͟͟͞͞𝑊ℎ𝑎𝑡'𝑠 𝐴𝑝𝑝
│ wa.me/9689)296280 ᥫ᭡
│ 📱 ⏤͟͟͞͞𝑇𝑖𝑘𝑇𝑜𝑘 
│ ෆ  j 𝑓𝑢𝑐𝑘  𝑒𝑑𝑖 𝑛ℎ𝑖 ლ
└───────────────ᥫ᭡

┌───────────────ᥫ᭡
│ 🕒 𝑈𝑝𝑑𝑎𝑡𝑒 𝑇𝑖𝑚𝑒
├───────────────ᜊ
│ ${time}
└───────────────ᥫ᭡
 `,
 attachment: fs.createReadStream(__dirname + "/cache/owner.jpg")
 }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/owner.jpg"));

 return request("https://i.imgur.com/oI69KWy.jpeg")
 .pipe(fs.createWriteStream(__dirname + '/cache/owner.jpg'))
 .on('close', () => callback());
};
