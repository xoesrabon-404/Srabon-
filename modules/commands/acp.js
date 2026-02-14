module.exports.config = {
  name: "acp",
  version: "1.1.0",
  hasPermssion: 2,
  credits: "rX Abdullah",
  description: "Accept or delete friend requests with beautiful frame UI 💫",
  commandCategory: "friend riqest",
  usages: "acp",
  cooldowns: 0
};

module.exports.handleReply = async ({ handleReply, event, api }) => {
  const { author, listRequest } = handleReply;
  if (author != event.senderID) return;

  const args = event.body.trim().split(/ +/);
  if (!args[0]) return api.sendMessage("⚠ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒: 𝑓𝑟𝑎𝑚 <𝑛𝑢𝑚𝑏𝑒𝑟 | 𝑎𝑙𝑙>", event.threadID);

  const form = {
    av: api.getCurrentUserID(),
    fb_api_caller_class: "RelayModern",
    variables: {
      input: {
        source: "friends_tab",
        actor_id: api.getCurrentUserID(),
        client_mutation_id: Math.round(Math.random() * 19).toString()
      },
      scale: 3,
      refresh_num: 0
    }
  };

  const success = [];
  const failed = [];

  // default to "add" type (fram)
  form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
  form.doc_id = "100089997213872";

  let targetIDs = args.slice(1);
  if (args[1] == "all" || args[0] == "all") {
    targetIDs = [];
    for (let i = 1; i <= listRequest.length; i++) targetIDs.push(i);
  }

  const promiseFriends = [];
  const newTargetIDs = [];

  for (const stt of targetIDs) {
    const u = listRequest[parseInt(stt) - 1];
    if (!u) {
      failed.push(`❌ | Not found index ${stt}`);
      continue;
    }
    form.variables.input.friend_requester_id = u.node.id;
    form.variables = JSON.stringify(form.variables);
    newTargetIDs.push(u);
    promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
    form.variables = JSON.parse(form.variables);
  }

  for (let i = 0; i < newTargetIDs.length; i++) {
    try {
      const friendRequest = await promiseFriends[i];
      if (JSON.parse(friendRequest).errors) failed.push(newTargetIDs[i].node.name);
      else success.push(newTargetIDs[i].node.name);
    } catch {
      failed.push(newTargetIDs[i].node.name);
    }
  }

  let msg = `✅ | 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑎𝑐𝑐𝑒𝑝𝑡𝑒𝑑 ${success.length} 𝑓𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠:\n`;
  msg += success.map((n, i) => `${i + 1}. ${n}`).join("\n");
  if (failed.length > 0)
    msg += `\n\n❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑎𝑐𝑐𝑒𝑝𝑡 ${failed.length}:\n${failed.join("\n")}`;

  api.sendMessage(msg, event.threadID, event.messageID);
};

module.exports.run = async ({ event, api }) => {
  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
    fb_api_caller_class: "RelayModern",
    doc_id: "100089997213872",
    variables: JSON.stringify({ input: { scale: 3 } })
  };

  const res = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form));
  const listRequest = res.data.viewer.friending_possibilities.edges;
  if (!listRequest || listRequest.length === 0)
    return api.sendMessage("✅ | No friend requests found.", event.threadID);

  let msg = `╭─‣ 👥 𝐒𝐮𝐠𝐠𝐞𝐬𝐭𝐞𝐝 𝐅𝐫𝐢𝐞𝐧𝐝𝐬 🎀\n├‣ 𝐀𝐝𝐦𝐢𝐧: ⏤͟͟͞͞𝐽𝑖ℎ𝑎𝑑 𝐻𝑎𝑠𝑎𝑛\n├‣ 𝐓𝐨𝐭𝐚𝐥 𝐔𝐬𝐞𝐫𝐬: ${listRequest.length}\n╰────────────◊\n`;

  let i = 0;
  for (const user of listRequest) {
    i++;
    msg += `\n╭─‣ ${i}: ${user.node.name}\n├‣ UID: ${user.node.id}\n├‣ Profile: ${user.node.url.replace("www.facebook", "fb")}\n╰────────────◊\n`;
  }

  msg += `\n📄 | 𝐑𝐞𝐩𝐥𝐲: fram <number | all>\nℹ | Example: fram 1 3 5  or  fram all`;

  api.sendMessage(msg, event.threadID, (err, info) => {
    if (err) return;
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      listRequest,
      author: event.senderID
    });
  });
};
