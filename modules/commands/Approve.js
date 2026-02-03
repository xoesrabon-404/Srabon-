/**
 * Approve Join Requests System
 * Platform: Facebook Messenger Group
 * Credits: Jihad
 */

const pending = {}; 
// structure: { threadID: [ { userID, name } ] }

module.exports.config = {
  name: "approve",
  version: "1.0.0",
  role: 2, // admin only
  author: "Jihad",
  description: "Approve group join requests by reply number",
  category: "group",
  usages: "approve",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, Threads }) {
  const threadID = event.threadID;

  // 🔹 Pending request আনো (Messenger API)
  let threadInfo;
  try {
    threadInfo = await api.getThreadInfo(threadID);
  } catch (e) {
    return api.sendMessage("❌ Thread info আনতে পারলাম না", threadID);
  }

  const requests = threadInfo.approvalQueue;

  if (!requests || requests.length === 0) {
    return api.sendMessage("✅ এখন কোনো pending request নাই", threadID);
  }

  // store pending list
  pending[threadID] = requests.map(u => ({
    userID: u.userID,
    name: u.fullName
  }));

  // message বানানো
  let msg = "📥 Pending Join Requests:\n\n";
  pending[threadID].forEach((u, i) => {
    msg += `${i + 1}. ${u.name}\n`;
  });

  msg += "\n👉 Reply with number (যেমন: 2) to approve";

  api.sendMessage(msg, threadID, (err, info) => {
    if (err) return;

    // handleReply register
    global.client.handleReply.push({
      name: module.exports.config.name,
      messageID: info.messageID,
      author: event.senderID,
      threadID
    });
  });
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { threadID } = event;

  // শুধু admin যে approve কমান্ড দিয়েছে সে reply দিতে পারবে
  if (event.senderID !== handleReply.author) return;

  const choice = parseInt(event.body);
  if (isNaN(choice)) return;

  const list = pending[threadID];
  if (!list || !list[choice - 1]) {
    return api.sendMessage("❌ ভুল নাম্বার", threadID);
  }

  const user = list[choice - 1];

  try {
    // 🔹 Approve user
    await api.addUserToGroup(user.userID, threadID);

    api.sendMessage(
      `✅ Approved Successfully\n👤 ${user.name}`,
      threadID
    );

    // remove approved user from list
    list.splice(choice - 1, 1);

    if (list.length === 0) {
      delete pending[threadID];
    }
  } catch (e) {
    api.sendMessage("❌ Approve করতে সমস্যা হয়েছে", threadID);
  }
};
