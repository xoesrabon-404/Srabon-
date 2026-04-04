const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
 name: "help",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Jihad",
 description: "Displays all available commands in one page",
 commandCategory: "system",
 usages: "[No args]",
 cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
 const { commands } = global.client;
 const { threadID, messageID } = event;

 const allCommands = [];

 for (let [name] of commands) {
 if (name && name.trim() !== "") {
 allCommands.push(name.trim());
 }
 }

 allCommands.sort();

 const finalText = `╔═══ᜊ ⏤͟͟͞͞𝐶𝑂𝑀𝑀𝐴𝑁𝐷 𝐿𝐼𝑆𝑇 ᜊ ᥫ᭡═══╗
${allCommands.map(cmd => `║ ➔ ${cmd}`).join("\n")}
╠═════⃝  ⏤͟͟͞͞𝐵𝑂𝑇 𝐼𝑁𝐹𝑂 ᭕  ⃝═════╣
║ 🤖 𝐵𝑂𝑇: ─ ⏤͟͟͞͞𝑆𝑅𝐴𝐵𝑂𝑁 𝐶𝐻𝐴𝑇 𝐵𝑂𝑇
║ 👑 𝑂𝑊𝑁𝐸𝑅 : ⏤͟͟͞͞𝐴𝐻𝑀𝐸𝐷 𝑆𝑅𝐴𝐵𝑂𝑁 
║ 📦 𝐶𝑂𝑀𝑀𝐴𝑁𝐷 : ${allCommands.length} 
╚══════════════════════╝`;

 
 const backgrounds = [
 "https://i.imgur.com/xv6vtfp.jpeg",
 "https://i.imgur.com/83vkYIx.jpeg",
 "https://i.imgur.com/pZK54LQ.jpeg",
 "https://i.imgur.com/oI69KWy.jpeg",
 ];
 const selectedBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
 const imgPath = __dirname + "/cache/helpallbg.jpg";

 const callback = () =>
 api.sendMessage({ body: finalText, attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);

 request(encodeURI(selectedBg))
 .pipe(fs.createWriteStream(imgPath))
 .on("close", () => callback());
};
