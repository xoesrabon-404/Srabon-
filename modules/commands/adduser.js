module.exports.config = {
  name: "add",
  version: "2.5.1",
  hasPermssion: 2,
  credits: "Jihad",
  description: "Add user to group by UID, link or reply (even if they left)",
  commandCategory: "group",
  usages: "add [uid/link] or reply with 'add'",
  cooldowns: 5
};

async function getUID(url, api) {
  if (url.includes("facebook.com") || url.includes("fb.com")) {
    try {
      if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
      let data = await api.httpGet(url);
      let redirectMatch = data.match(/for \(;;\);{"redirect":"(.*?)"}/);
      if (redirectMatch) {
        data = await api.httpGet(redirectMatch[1].replace(/\\/g, "").replace(/(?<=\?\s*)(.*)/, "").slice(0, -1));
      }
      const idMatch = data.match(/"userID":"(\d+)"/);
      const nameMatch = data.match(/"title":"(.*?)"/);
      const name = nameMatch ? JSON.parse('{"name":"' + nameMatch[1] + '"}').name : null;
      return [idMatch ? +idMatch[1] : null, name, false];
    } catch (err) {
      return [null, null, true];
    }
  } else {
    return ["Please provide a valid Facebook URL.", null, true];
  }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;
  const botID = api.getCurrentUserID();
  const send = msg => api.sendMessage(msg, threadID, messageID);

  const { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
  const currentMembers = participantIDs.map(e => parseInt(e));
  const botIsAdmin = adminIDs.map(a => a.id).includes(botID);

  let targetID = null;
  let targetName = "User";

  if (messageReply && (!args[0] || args[0].toLowerCase() === "add")) {
    targetID = messageReply.senderID;
    try {
      const info = await api.getUserInfo(targetID);
      targetName = info[targetID]?.name || "User";
    } catch (e) {
      targetName = "User";
    }
  } else if (args[0] && !isNaN(args[0])) {
    targetID = parseInt(args[0]);
    try {
      const info = await api.getUserInfo(targetID);
      targetName = info[targetID]?.name || "User";
    } catch (e) {
      targetName = "User";
    }
  } else if (args[0]) {
    const [id, name, fail] = await getUID(args[0], api);
    if (fail && id) return send(id);
    if (!id) return send(boxText("❌ 𝐸𝑟𝑟𝑜𝑟", "𝑈𝑠𝑒𝑟 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑜𝑓 𝑖𝑛𝑣𝑎𝑙𝑖𝑑𝑎𝑡𝑒 𝑙𝑖𝑛𝑘"));
    targetID = id;
    targetName = name || "User";
  } else {
    return send(boxText("⚠️ 𝑈𝑠𝑎𝑔𝑒", "𝑎𝑑𝑑 [𝑢𝑖𝑑/𝑙𝑖𝑛𝑘] 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ '𝑎𝑑𝑑'"));
  }

  if (!targetID) return send(boxText("❌ Error", "Invalid user ID or link."));

  if (currentMembers.includes(targetID)) {
    return send(boxText("ℹ️ 𝐼𝑛𝑓𝑜", `${targetName} 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝`));
  }

  try {
    await api.addUserToGroup(targetID, threadID);
  } catch (err) {
    return send(boxText("❌ 𝐹𝑎𝑖𝑙𝑒𝑑", `𝑆𝑜𝑟𝑟𝑦 𝑏𝑜𝑠𝑠!\n${targetName} 𝑚𝑎𝑦𝑏𝑒 ℎ𝑎𝑣𝑒 𝑝𝑟𝑖𝑣𝑎𝑐𝑦 \n 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 𝑜𝑟 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑙𝑒𝑓𝑡`));
  }

  if (approvalMode && !botIsAdmin) {
    return send(boxText("⏳ 𝑃𝑒𝑛𝑑𝑖𝑛𝑔", `𝐴𝑑𝑑𝑎𝑑 ${targetName} 𝑡𝑜 𝑎𝑝𝑝𝑟𝑜𝑣𝑎𝑙 𝑙𝑖𝑠𝑡 \n𝑊𝑎𝑡𝑖𝑛𝑔 𝑓𝑜𝑟 𝑎𝑑𝑚𝑖𝑛 𝐴𝑝𝑝𝑟𝑜𝑣𝑎𝑙.....`));
  } else {
    return send(boxText("✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠", `𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑎𝑑𝑑𝑒𝑑 \n 𝑁𝑎𝑚𝑒 : ${targetName} 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 ✅`));
  }
};

// Box function
function boxText(title, body) {
  return `════════════════════
  ${title}
═══════════════════
${body}

═══════════════════`;
}
