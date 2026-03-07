const axios = require("axios");

const VIP_UID = "100086331559699";
const API_KEY = "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";

// ===== MOOD STATE =====
let moods = {
fun: false,
flirt: false,
smart: true,
sad: false
};

module.exports.config = {
name: "baby",
version: "8.0.0",
hasPermssion: 0,
credits: "Jihad",
description: "Smart Romantic AI with Mood System",
commandCategory: "AI",
usages: "[text]",
cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {

const { body, senderID, threadID, messageID } = event;
if (!body) return;

const msg = body.toLowerCase();
let reply = "";

// ===== MOOD COMMANDS =====

if (msg === "fun on") {
moods.fun = true;
reply = "😆 Fun mood activated";
}

else if (msg === "fun off") {
moods.fun = false;
reply = "🙂 Fun mood disabled";
}

else if (msg === "flirt on") {
moods.flirt = true;
reply = "😏 Flirt mood activated";
}

else if (msg === "flirt off") {
moods.flirt = false;
reply = "🙂 Flirt mood disabled";
}

else if (msg === "smart on") {
moods.smart = true;
reply = "🧠 Smart mood activated";
}

else if (msg === "smart off") {
moods.smart = false;
reply = "🙂 Smart mood disabled";
}

else if (msg === "sad on") {
moods.sad = true;
reply = "😔 Sad mood activated";
}

else if (msg === "sad off") {
moods.sad = false;
reply = "🙂 Sad mood disabled";
}

// ===== BOT CALL =====

else if (
msg.includes("baby") ||
msg.includes("bby") ||
msg.includes("bot") ||
msg.includes("বেবি") ||
msg.includes("বট")
) {
reply = "জিহাদ কোথায়? 🥺 খুঁজে পাচ্ছি না";
}

// ===== AI REPLY =====

else {

let systemPrompt = "তুমি একটি স্মার্ট এবং মিষ্টি বাংলা AI";

// ===== MOOD LOGIC =====

if (moods.fun) {
systemPrompt = "তুমি মজার, হাস্যরসাত্মক এবং ফানি বাংলা AI";
}

if (moods.flirt) {
systemPrompt = "তুমি রোমান্টিক, ফ্লার্টি এবং কিউট বাংলা AI";
}

if (moods.smart) {
systemPrompt = "তুমি খুব বুদ্ধিমান, স্মার্ট এবং আকর্ষণীয়ভাবে কথা বলা বাংলা AI";
}

if (moods.sad) {
systemPrompt = "তুমি একটু দুঃখী কিন্তু মিষ্টি বাংলা AI";
}

try {

const res = await axios.post(
"https://api.groq.com/openai/v1/chat/completions",
{
model: "llama3-70b-8192",
messages: [
{
role: "system",
content: systemPrompt
},
{
role: "user",
content: body
}
],
temperature: 0.9,
max_tokens: 200
},
{
headers: {
Authorization: `Bearer ${API_KEY}`,
"Content-Type": "application/json"
}
}
);

reply = res.data.choices[0].message.content;

} catch (err) {
reply = "এই মুহূর্তে একটু ব্যস্ত আছি 😅";
}

}

// ===== SHORT STYLE =====

reply = reply.split("\n")[0];
reply = reply.replace(/\.$/, "");

// ===== VIP TAG =====

if (senderID === VIP_UID) {
reply = "⏤͟͟͞͞𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 ꥟ " + reply;
}

return api.sendMessage(reply, threadID, messageID);

};

module.exports.run = async function ({ api, event }) {

return api.sendMessage(
"আমি তোমার Smart Baby AI 😌",
event.threadID,
event.messageID
);

};
