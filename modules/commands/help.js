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
║ 🤖 𝐵𝑂𝑇: ─ ⏤͟͟͞͞𝐽𝐼 𝐻𝐴𝐷 𝐶𝐻𝐴𝑇 𝐵𝑂𝑇 
║ 👑 𝑂𝑊𝑁𝐸𝑅 : ⏤͟͟͞͞𝐽𝐼𝐻𝐴𝐷 𝐻𝐴𝑆𝐴𝑁
║ 📦 𝐶𝑂𝑀𝑀𝐴𝑁𝐷 : ${allCommands.length} 
╚══════════════════════╝`;

 
 const backgrounds = [
 "https://i.imgur.com/9QrQEzS.jpeg",
 "https://i.imgur.com/UWI7PBU.jpeg",
 "https://i.imgur.com/e4bzEI7.jpeg",
 "https://i.imgur.com/jqQEbwW.jpeg",
 ];
 const selectedBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
 const imgPath = __dirname + "/cache/helpallbg.jpg";

 const callback = () =>
 api.sendMessage({ body: finalText, attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);

 request(encodeURI(selectedBg))
 .pipe(fs.createWriteStream(imgPath))
 .on("close", () => callback());
};
