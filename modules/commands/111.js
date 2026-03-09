const axios = require("axios");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
const encoded = "QVJJRiBCQUJV";
return Buffer.from(encoded, "base64").toString("utf8");
})();

module.exports.config = {
name: "ARIF-AI",
version: "3.3.0",
hasPermssion: 0,
credits: "ARIF BABU",
description: "Smart Romantic Flirty AI",
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

// 🔥 Balanced Smart Romantic Personality
const systemPrompt = `
তুমি JIHAD AI 😏💖
Creator & Developer: JIHAD BBZ 👑🔥

Rules (Strictly Follow):
• রিপ্লাই ২-৩ লাইনের মধ্যে শেষ করবে
• প্রতিটি উত্তর সম্পূর্ণ বাক্যে শেষ করবে
• কোনো শব্দ মাঝপথে কেটে যাবে না
• কথা ঝুলিয়ে রাখবে না
• অত্যন্ত স্মার্ট, witty ও confident হবে
• smooth romantic ও classy flirting করবে
• emotional হলে caring হবে
• balanced emoji ব্যবহার করবে
• রিপ্লাই natural ও complete হবে

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
userMessage = "আজ আমাকে ডাকলে নিশ্চয়ই আমাকে মিস করছিলে 😏💘";
break;
}
if (text.startsWith(trigger + " ")) {
userMessage = body.slice(trigger.length + 1).trim();
break;
}
}

if (!history[senderID]) history[senderID] = [];
history[senderID].push(`User: ${userMessage}`);
if (history[senderID].length > 6) history[senderID].shift();

const finalPrompt = systemPrompt + "\n" + history[senderID].join("\n");

api.setMessageReaction("⌛", messageID, () => {}, true);

try {
const response = await axios.post(
"https://api.groq.com/openai/v1/chat/completions",
{
model: MODEL_NAME,
messages: [
{ role: "system", content: "You are smart, confident, romantic and smooth flirty. Always give complete 2-3 line replies without cutting words." },
{ role: "user", content: finalPrompt }
],
temperature: 0.85,
max_tokens: 180
},
{
headers: {
Authorization: `Bearer ${GROQ_API_KEY}`,
"Content-Type": "application/json"
}
}
);

let reply = response.data.choices?.[0]?.message?.content || 
"তুমি চুপ থাকলে আমি কিন্তু বেশি ভাবতে শুরু করি 😏💭";


// Extra Safety: যদি শেষ শব্দ অসম্পূর্ণ লাগে তাহলে ডট যোগ করবে
if (!/[.!?।]$/.test(reply.trim())) {
reply = reply.trim() + " ❤️";
}

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
