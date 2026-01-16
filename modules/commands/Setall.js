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
    return api.sendMessage("✅ সবার nickname ক্লিয়ার করা হয়েছে", event.threadID);
  }

  // 🔹 setall
  const name = args.join(" ");
  if (!name) {
    return api.sendMessage(
      "😐 নাম তো দে ভাই\nUsage: setall Name",
      event.threadID,
      event.messageID
    );
  }

  for (const id of members) {
    await new Promise(r => setTimeout(r, 1200));
    api.changeNickname(name, event.threadID, id);
  }

  api.sendMessage(`✅ সবার nickname সেট করা হয়েছে:\n${name}`, event.threadID);
};
