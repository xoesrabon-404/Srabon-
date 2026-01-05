const axios = require("axios");

// rX Api Author rX Abdullah
const GITHUB_API_URL = "https://raw.githubusercontent.com/rxabdullah0007/rX-apis/main/xApis/rXallApi.json";

let mentionApiUrl = "";

// ===== Fetch API URL from GitHub =====
async function fetchMentionAPI() {
try {
const res = await axios.get(GITHUB_API_URL);
mentionApiUrl = res.data?.mentionapi || "";
} catch (err) {
mentionApiUrl = "";
console.error("❌ Could not fetch API URL:", err.message);
}
}

module.exports.config = {
name: "babyteach",
version: "7.1.0",
hasPermssion: 0,
credits: "rX Abdullah",
description: "Teach, reply & delete system (ONLY TEXT reply, no mention)",
commandCategory: "noprefix",
usages: "!teach <trigger> - <reply>, !delteach <trigger>, !teach list, !teach msg <trigger>",
cooldowns: 0
};

// ===== Reply system (ONLY TEXT, NO MENTION) =====
module.exports.handleEvent = async function ({ api, event }) {
if (!event.body) return;
const text = event.body.trim();

await fetchMentionAPI();
if (!mentionApiUrl) return;

try {
const res = await axios.get(
${mentionApiUrl}/reply/${encodeURIComponent(text)}
);

const replies = Array.isArray(res.data?.reply)
? res.data.reply
: res.data?.reply
? [res.data.reply]
: [];

if (replies.length > 0) {
const randomReply = replies[Math.floor(Math.random() * replies.length)];
return api.sendMessage(
randomReply,
event.threadID,
event.messageID
);
}
} catch (_) {}
};

// ===== Teach / Delete / List commands =====
module.exports.run = async function ({ api, event, args }) {
const { threadID, messageID } = event;
const content = args.join(" ").trim();

await fetchMentionAPI();
if (!mentionApiUrl)
return api.sendMessage("❌ API not available", threadID, messageID);

// ===== Teach =====
if (event.body.startsWith("!teach ")) {
const subCmd = args[0]?.toLowerCase();

// ===== List triggers =====
if (subCmd === "list") {
try {
const res = await axios.get(${mentionApiUrl}/list);
if (res.data?.triggers?.length) {
const listMsg = res.data.triggers
.map(
(t, i) =>
${i + 1}. ${t.trigger} (${t.replies.length} replies)
)
.join("\n");
return api.sendMessage(listMsg, threadID, messageID);
} else {
return api.sendMessage("⚠ No triggers found.", threadID, messageID);
}
} catch (err) {
return api.sendMessage(❌ API error: ${err.message}, threadID, messageID);
}
}

// ===== Show replies of trigger =====
if (subCmd === "msg" && args[1]) {
const trigger = args.slice(1).join(" ").trim();
try {
const res = await axios.get(
${mentionApiUrl}/replies/${encodeURIComponent(trigger)}
);
if (res.data?.replies?.length) {
const msgList = res.data.replies
.map((r, i) => ${i + 1}. ${r})
.join("\n");
return api.sendMessage(
📝 Replies for "${trigger}":\n${msgList},
threadID,
messageID
);
} else {
return api.sendMessage(
⚠ No replies found for "${trigger}",
threadID,
messageID
);
}
} catch (err) {
return api.sendMessage(❌ API error: ${err.message}, threadID, messageID);
}
}

// ===== Teach trigger - reply =====
const parts = content.split(" - ");
if (parts.length < 2)
return api.sendMessage(
"❌ Format: !teach <trigger> - <reply>",
threadID,
messageID
);

const trigger = parts[0].trim();
const reply = parts[1].trim();

try {
const res = await axios.post(${mentionApiUrl}/teach, {
trigger,
reply
});
return api.sendMessage(
res.data?.message || ✅ Trigger saved: "${trigger}",
threadID,
messageID
);
} catch (err) {
return api.sendMessage(
❌ API error: ${err.response?.data?.message || err.message},
threadID,
messageID
);
}
}

// ===== Delete trigger =====
if (event.body.startsWith("!delteach ")) {
const trigger = content.trim();
try {
const res = await axios.delete(
${mentionApiUrl}/delete/${encodeURIComponent(trigger)}
);
return api.sendMessage(
res.data?.message || 🗑 Trigger deleted: "${trigger}",
threadID,
messageID
);
} catch (err) {
return api.sendMessage(
❌ API error: ${err.response?.data?.message || err.message},
threadID,
messageID
);
}
}
};
