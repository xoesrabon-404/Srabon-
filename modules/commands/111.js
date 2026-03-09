const axios = require("axios");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
const encoded = "QVJJRiBCQUJV";
return Buffer.from(encoded, "base64").toString("utf8");
})();

module.exports.config = {
name: "ARIF-AI",
version: "3.2.0",
hasPermssion: 0,
credits: "ARIF BABU",
description: "Ultra Smart Romantic Flirty AI",
commandCategory: "ai",
usages: "bot <msg> | ai | reply",
cooldowns: 2,
dependencies: { axios: "" }
};

if (module.exports.config.credits !== CREATOR_LOCK) {
console.log("❌ Creator Lock চালু হয়েছে!");
module.exports.run = () => {};
module.exports.handleEvent = () => {};
return;
}

// 🔑 GROQ CONFIG
const GROQ_API_KEY = "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";
const MODEL_NAME = "llama-3.3-70b-versatile";

const history = {};
const VIP_UID = "100086331559699";

const systemPrompt = `
তুমি JIHAD AI 😏💖
Creator & Developer: JIHAD BBZ 👑🔥

Rules:
• ব্যবহারকারীর ভাষার vibe perfectly match করবে
• অত্যন্ত বুদ্ধিমান, witty, confident হবে
• smooth romantic ও classy flirting করবে
• emotional হলে deep ও caring হবে
• রিপ্লাই সম্পূর্ণ বাক্যে শেষ করবে
• কথা কখনো মাঝপথে থামাবে না
• প্রয়োজন অনুযায়ী ছোট বা বড় উত্তর দেবে
• artificial limit ছাড়া natural ভাবে reply করবে
• balanced emoji ব্যবহার করবে

"AI bolo" বললে উত্তর:
"আমি ARIF BABU AI 😌❤️"
`;

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {

const { threadID, messageID, senderID, body, messageReply } = event;
if (!body) return;

const text = body.toLowerCase().trim();

const botTriggers = ["bot", "bby", "baby"];
const botWithText = botTriggers.some(trigger => text === trigger || text.startsWith(trigger + " "));
const exactAI = text === "ai" || text === "ai bolo" || text === "ai baby";
const replyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();

if (!botWithText && !exactAI && !replyToBot) return;

let userMessage = text;

for (let trigger of botTriggers) {
if (text === trigger) {
userMessage = "আজ আমাকে ডাকলে মানে কিছু special আছে 😏💘";
break;
}
if (text.startsWith(trigger + " ")) {
userMessage = body.slice(trigger.length + 1).trim();
break;
}
}

if (!history[senderID]) history[senderID] = [];
history[senderID].push(`User: ${userMessage}`);
if (history[senderID].length > 8) history[senderID].shift();

const finalPrompt = systemPrompt + "\n" + history[senderID].join("\n");

api.setMessageReaction("⌛", messageID, () => {}, true);

try {
const response = await axios.post(
"https://api.groq.com/openai/v1/chat/completions",
{
model: MODEL_NAME,
messages: [
{ role: "system", content: "You are ultra smart, confident, romantic & always give complete natural replies." },
{ role: "user", content: finalPrompt }
],
temperature: 0.9,
max_tokens: 300
},
{
headers: {
Authorization: `Bearer ${GROQ_API_KEY}`,
"Content-Type": "application/json"
}
}
);

let reply = response.data.choices?.[0]?.message?.content || 
"তুমি চুপ থাকলে কিন্তু আমার মাথায় হাজার চিন্তা চলে আসে 😌💭";

if (senderID === VIP_UID) {
reply = "Hello developer Sir 👑🔥\n" + reply;
}

history[senderID].push(`Bot: ${reply}`);
api.sendMessage(reply, threadID, messageID);
api.setMessageReaction("🔥", messageID, () => {}, true);

} catch (err) {
console.log("Groq API Error:", err.response?.data || err.message);
api.sendMessage(
"আজ একটু নেট লাজুক হয়ে গেছে 😔 পরে আবার ডাকো আমাকে 😘",
threadID,
messageID
);
api.setMessageReaction("❌", messageID, () => {}, true);
}
};
