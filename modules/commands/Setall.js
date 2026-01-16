module.exports.config = {
  name: "setall",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "Khánh Milo | Modified by Jihad",
  description: "Set or clear nickname of all members",
  commandCategory: "GROUP",
  usages: "setall <Name> | clearall",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const command = args[0];

  const threadInfo = await api.getThreadInfo(event.threadID);
  const members = threadInfo.participantIDs;

  // 🔹 clearall
  if (command === "clearall") {
    for (const id of members) {
      await new Promise(r => setTimeout(r, 1200));
      api.changeNickname("", event.threadID, id);
    }
    return api.sendMessage("⏤͟͟͞͞۝𝐸𝑣𝑒𝑟𝑦𝑜𝑛𝑒 𝑁𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝐻𝑎𝑠 𝐶𝑙𝑒𝑎𝑟 ⚉", event.threadID);
  }

  // 🔹 setall
  const name = args.join("⏤͟͟͞͞۝𝐸𝑣𝑒𝑟𝑦𝑜𝑛𝑒 𝑁𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝐻𝑎𝑠 𝐵𝑒𝑒𝑛 𝑆𝑒𝑡 ⚉");
  if (!name) {
    return api.sendMessage(
      "⏤͟͟͞͞۝𝑆𝑖𝑟 𝑃𝑙𝑒𝑎𝑠𝑒 𝐺𝑖𝑣𝑒 𝑀𝑒 𝑎 𝑁𝑖𝑐𝑘𝑛𝑎𝑚𝑒 ☺︎\nUsage: setall Name",
      event.threadID,
      event.messageID
    );
  }

  for (const id of members) {
    await new Promise(r => setTimeout(r, 1200));
    api.changeNickname(name, event.threadID, id);
  }

  api.sendMessage(`\n${name}`, event.threadID);
};
