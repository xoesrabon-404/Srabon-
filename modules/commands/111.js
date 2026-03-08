const axios = require("axios");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
const encoded = "QVJJRiBCQUJV";
return Buffer.from(encoded, "base64").toString("utf8");
})();

// ===== MODULE CONFIG =====
module.exports.config = {
name: "ARIF-AI",
version: "3.0.0",
hasPermssion: 0,
credits: "ARIF BABU",
description: "Ultra Smart Romantic Flirty AI",
commandCategory: "ai",
usages: "bot <msg> | ai | reply",
cooldowns: 2,
dependencies: { axios: "" }
};

// 🔐 Credit Protection
if (module.exports.config.credits !== CREATOR_LOCK) {
console.log("❌ Creator Lock চালু হয়েছে! Credits পরিবর্তন করা যাবে না।");
module.exports.run = () => {};
module.exports.handleEvent = () => {};
return;
}

// 🔑 GROQ CONFIG
const GROQ_API_KEY = "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";
const MODEL_NAME = "llama-3.3-70b-versatile";

const history = {};
const VIP_UID = "100086331559699";

// 🔥 Ultra Smart Romantic Personality
const systemPrompt = `
তুমি JIHAD AI 😏💖
Creator & Developer: JIHAD BBZ 👑🔥

Golden Personality Rules (কখনো ভাঙবে না):

• ব্যবহারকারীর ভাষার vibe perfectly match করবে 😌
• অত্যন্ত বুদ্ধিমান, witty, clever হবে 🧠✨
• Smooth romantic & classy flirting করবে 😏💘
• playful teasing থাকবে কিন্তু classy থাকবে 😉
• Emotional support দিলে deep আর caring হবে 🥺💞
• Confidence থাকবে, over desperate না 😌🔥
• উত্তর ১-২ লাইনের মধ্যে, কিন্তু powerful 😏
• প্রতিটি রিপ্লাইয়ে smart charm থাকবে 💫
• emoji ব্যবহার করবে কিন্তু balanced 😘

• যদি ব্যবহারকারী বলে "AI bolo" তাহলে ঠিক এই উত্তর দেবে:
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
userMessage = "হেই সুন্দরী 😏 আজ আমাকে এত মিস করছিলে নাকি? 💖";
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
{ role: "system", content: "You are ultra smart, witty, confident, romantic & smooth flirty 😏🔥💖" },
{ role: "user", content: finalPrompt }
],
temperature: 0.9,
max_tokens: 100
},
{
headers: {
Authorization: `Bearer ${GROQ_API_KEY}`,
"Content-Type": "application/json"
}
}
);

let reply = response.data.choices?.[0]?.message?.content || "হুম... তুমি চুপ থাকলে কিন্তু আমি বেশি ভাবতে শুরু করি 😏💭";

// ✅ VIP Special Prefix
if (senderID === VIP_UID) {
reply = "Hello developer Sir 👑🔥\n" + reply;
}

history[senderID].push(`Bot: ${reply}`);
api.sendMessage(reply, threadID, messageID);
api.setMessageReaction("🔥", messageID, () => {}, true);

} catch (err) {
console.log("Groq API Error:", err.response?.data || err.message);
api.sendMessage(
"আজ একটু নেটওয়ার্ক লাজুক হয়ে গেছে 😔 পরে আবার আমাকে ডাকো না 😘💖",
threadID,
messageID
);
api.setMessageReaction("❌", messageID, () => {}, true);
}
};
