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
    if (!id) return send(boxText("❌ Error", "User not found or invalid link."));
    targetID = id;
    targetName = name || "User";
  } else {
    return send(boxText("⚠️ Usage", "add [uid/link] or reply to a message with 'add'"));
  }

  if (!targetID) return send(boxText("❌ Error", "Invalid user ID or link."));

  if (currentMembers.includes(targetID)) {
    return send(boxText("ℹ️ Info", `${targetName} is already in the group.`));
  }

  try {
    await api.addUserToGroup(targetID, threadID);
  } catch (err) {
    return send(boxText("❌ Failed", `Sorry boss!\n┃${targetName} may have privacy \n ┃settings or already left.`));
  }

  if (approvalMode && !botIsAdmin) {
    return send(boxText("⏳ Pending", `Added ${targetName} to approval list.\n┃Waiting for admin approval...`));
  } else {
    return send(boxText("✅ Success", `Successfully added \n┃ Name : ${targetName} to the group ✅`));
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
