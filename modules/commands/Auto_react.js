module.exports.config = {
  name: "autoreact",
  version: "3.0.0",
  hasPermission: 0,
  credits: "Jihad",
  description: "Auto React On/Off System",
  commandCategory: "No Prefix",
  cooldowns: 0
};

module.exports.handleEvent = async ({ api, event, Threads }) => {
  try {
    if (!event.body) return;

    const threadID = event.threadID;
    const messageID = event.messageID;

    const threadData = await Threads.getData(threadID);
    const data = threadData.data || {};

    if (data.autoreact !== true) return;

    const emojis = [
      "🥰","😗","🍂","💜","☺️","🖤","🤗","😇","🌺","🥹",
      "😻","😘","🫣","😽","😺","👀","❤️","🫶","🤔"
    ];

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    api.setMessageReaction(randomEmoji, messageID, () => {}, true);

  } catch (err) {
    console.log("AutoReact Error:", err);
  }
};

module.exports.run = async ({ api, event, Threads }) => {
  const { threadID, messageID, body } = event;

  const threadData = await Threads.getData(threadID);
  const data = threadData.data || {};

  const command = body.toLowerCase();

  if (command === ".autoreacton") {
    data.autoreact = true;
    await Threads.setData(threadID, { data });
    global.data.threadData.set(threadID, data);

    return api.sendMessage("🟢 Auto React Turned ON", threadID, messageID);
  }

  if (command === ".autoreactoff") {
    data.autoreact = false;
    await Threads.setData(threadID, { data });
    global.data.threadData.set(threadID, data);

    return api.sendMessage("🔴 Auto React Turned OFF", threadID, messageID);
  }
};
