const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");

// File paths
const TEXT_OFF_FILE = path.join(__dirname, "textOff.json");
const KICK_COUNT_FILE = path.join(__dirname, "kickCount.json");

// Load data from JSON files
const loadData = (file, defaultValue = {}) => {
  try {
    if (fs.existsSync(file)) {
      const data = fs.readJsonSync(file);
      return new Map(Object.entries(data));
    }
  } catch (err) {
    console.error(`Error loading ${file}:`, err);
  }
  return new Map();
};

// Save data to JSON files
const saveData = (file, map) => {
  try {
    const obj = Object.fromEntries(map);
    fs.writeJsonSync(file, obj, { spaces: 2 });
  } catch (err) {
    console.error(`Error saving ${file}:`, err);
  }
};

// Initialize persistent storage
const textOffMode = loadData(TEXT_OFF_FILE);     // threadID => boolean
const kickCount = loadData(KICK_COUNT_FILE);     // "threadID_userID" => count

module.exports.config = {
  name: "text off",
  version: "1.2.0",
  hasPermssion: 2,
  credits: "Jihad",
  description: "Toggle Text Off mode per group with Auto Kick + JSON Save",
  commandCategory: "admin",
  usages: ".textoff",
  cooldowns: 3
};

// ===== Command to toggle Text Off =====
module.exports.run = async function({ api, event, args }) {
  const { threadID, senderID, messageID } = event;
  const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

  // Get group admin list
  let adminIDs = [];
  try {
    const info = await api.getThreadInfo(threadID);
    adminIDs = info.adminIDs.map(a => a.id);
  } catch (err) {
    console.error("Error fetching admin list:", err);
  }

  const isBotAdmin = global.config.ADMINBOT.includes(senderID);
  const isGroupAdmin = adminIDs.includes(senderID);

  if (!isBotAdmin && !isGroupAdmin) {
    return api.sendMessage("❌ Only admins can use this command!", threadID, messageID);
  }

  // Toggle per group
  const current = textOffMode.get(threadID) || false;
  const newState = !current;
  textOffMode.set(threadID, newState);

  // Save to file
  saveData(TEXT_OFF_FILE, textOffMode);

  // Small emoji box
  const boxMessage = 
    `╭──🌸 Text Off Mode 🌸──╮\n` +
    `│ Group ID: ${threadID}\n` +
    `│ Mode: ${newState ? "🛡️ Admins Only" : "👥 Everyone"}\n` +
    `│ ${newState ? "⚠️ Non-admins will \n│ be auto-kicked" : "✅ Auto-kick OFF"}\n` +
    `│ Time: ${time}\n` +
    `╰───────────────────╯`;

  api.sendMessage(boxMessage, threadID);
};

// ===== Auto Kick on Message =====
module.exports.handleEvent = async function({ api, event }) {
  const { threadID, senderID, messageID, body, attachments, isGroup } = event;

  if (!isGroup) return;
  if (!textOffMode.get(threadID)) return;

  const botID = api.getCurrentUserID();
  if (senderID === botID) return;

  // Get group admins
  let adminIDs = [];
  try {
    const info = await api.getThreadInfo(threadID);
    adminIDs = info.adminIDs.map(a => a.id);
  } catch (err) {
    console.error("Error fetching group admins:", err);
  }

  if (global.config.ADMINBOT.includes(senderID) || adminIDs.includes(senderID)) return;

  // Check if user sent any message or attachment
  const hasMessage = (body && body.trim() !== "") || (attachments && attachments.length > 0);

  if (hasMessage) {
    const kickKey = `${threadID}_${senderID}`;
    const count = (kickCount.get(kickKey) || 0) + 1;
    kickCount.set(kickKey, count);
    saveData(KICK_COUNT_FILE, kickCount);

    // Try to delete the message
    try { await api.removeMessage(messageID); } catch(e){}

    // Auto Kick warning small box
    const warningBox = 
      `╭─🚨 Auto Kick 🚨─╮\n` +
      `│ Text Off is ON!\n` +
      `│ Only admins can \n│ send messages\n` +
      `│ Kick Count: ${count}\n` +
      `╰────────────────╯`;

    api.sendMessage(warningBox, threadID);

    // Kick user
    try {
      await api.removeUserFromGroup(senderID, threadID);
      console.log(`[KICK] ${senderID} from ${threadID} | Count: ${count}`);
    } catch (err) {
      console.error("Kick failed:", err);
      api.sendMessage("⚠️ Failed to kick user. (Bot must be admin)", threadID);
    }
  }
};

// ===== On Load =====
module.exports.onLoad = function() {
  console.log("✅ Text Off & Kick Count loaded from JSON files (By Jihad).");
};
