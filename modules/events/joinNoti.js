const fs = require("fs-extra");

module.exports.config = {
  name: "joinnoti",
  version: "4.3.0",
  credits: "rX Abdullah",
  eventType: ["log:subscribe"],
  description: "Text-only welcome message, persistent notice"
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, logMessageData } = event;
  const added = logMessageData.addedParticipants?.[0];
  if (!added) return;

  const userID = added.userFbId;
  const botID = api.getCurrentUserID();

  // ===== Bot যোগ হলে =====
  if (userID == botID) {
    // শুধু নাম পরিবর্তন হবে, কোনো বার্তা পাঠানো হবে না
    await api.changeNickname("𝔸𝕚 𝔸𝕤𝕤𝕚𝕤𝕥𝕒𝕟𝕥", threadID, botID);
    return;
  }

  // ===== সাধারণ ইউজার যোগ হলে =====
  const userName = added.fullName;
  const info = await api.getThreadInfo(threadID);
  const groupName = info.threadName;

  const memberCount = info.participantIDs.length;
  const male = info.userInfo.filter(u => u.gender === "MALE").length;
  const female = info.userInfo.filter(u => u.gender === "FEMALE").length;

  const inviterID = event.author;
  const inviterName = await Users.getNameUser(inviterID);

  // আগের মতো বডি মেসেজ, text-only
  const message = `
KE KOTHAY ACHO SHOBAI DEKHO (NAME)
LUCHCHA / LUCHCHI EI MESSAGE UNSEND
WELCOME ${userName} to ${groupName}!
Members: ${memberCount} | Male: ${male} | Female: ${female}
Invited by: ${inviterName}
`;

  api.sendMessage(message, threadID);
};
