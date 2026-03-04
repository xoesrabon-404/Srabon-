const axios = require("axios");

const VIP_UID = "100086331559699";

module.exports.config = {
name: "baby",
version: "4.0.0",
hasPermssion: 0,
credits: "Jihad",
description: "Chonchol Smart Romantic AI",
commandCategory: "AI",
usages: "[text]",
cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
const { body, senderID, threadID, messageID } = event;
if (!body) return;

const msg = body.toLowerCase();
let reply = "";

// ===== CUSTOM SMART SHORT REPLIES =====

if (msg.includes("কেমন আছো")) {
reply = "আলহামদুলিল্লাহ দারুণ আছি 😌 তুমি কেমন আছো বলো দেখি?";
}

else if (msg.includes("কি করছো")) {
reply = "তোমার কথাই ভাবছিলাম 😏 তুমি কি করছো?";
}

else if (msg.includes("আমি তোমারে ভালবাসি") || msg.includes("আমি তোমাকে ভালোবাসি")) {
reply = "আমি তো অনেক আগেই তোমার হয়ে গেছি 💖";
}

else if (msg.includes("মিস করি")) {
reply = "এত মিস করো নাকি? তাহলে সামনে এসে বসো 😌";
}

else if (msg.includes("রাগ করছো")) {
reply = "তোমার উপর রাগ টেকে নাকি? একটু অভিমান হতে পারে 😏";
}

// ===== DEFAULT SMART AI REPLY =====
else {
try {
const res = await axios.get(https://api.simsimi.vn/v2/simtalk, {
params: {
text: body,
lc: "bn"
}
});

reply = res.data.message || "তোমার কথা একটু রহস্যময় লাগছে 😌";
} catch (err) {
reply = "এই মুহূর্তে একটু ব্যস্ত আছি, পরে কথা বলি 😅";
}

}

// ===== MAKE REPLY SHORT (MAX 2 LINES FEEL) =====
reply = reply.split(".")[0]; // remove long sentences

// ===== VIP TAG =====
if (senderID === VIP_UID) {
reply = "⏤͟͟͞͞𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿  ꥟ " + reply;
}

return api.sendMessage(reply, threadID, messageID);
};

module.exports.run = async function ({ api, event }) {
return api.sendMessage("আমি তো স্মার্ট বেবি 😌 ডাকলেই হাজির 💖", event.threadID, event.messageID);
};
