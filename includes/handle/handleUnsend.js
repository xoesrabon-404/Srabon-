module.exports = function ({ api }) {
  return function ({ event }) {
    const { senderID, reaction, messageID } = event;

    // 😡 ছাড়া কিছু করবে না
    if (reaction !== "😡") return;

    // শুধু এই ২টা UID
    const allowedUIDs = [
      "UID_1_HERE",
      "UID_2_HERE"
    ];

    // UID ম্যাচ না করলে কাজ করবে না
    if (!allowedUIDs.includes(senderID)) return;

    // বটের মেসেজ unsend
    api.unsendMessage(messageID);
  };
};
