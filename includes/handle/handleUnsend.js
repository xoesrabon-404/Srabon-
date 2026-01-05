module.exports = function ({ api }) {
  return function ({ event }) {
    const { senderID, reaction, messageID } = event;

    // 😡 ছাড়া কিছু করবে না
    if (reaction !== "😡") return;

    // শুধু এই ২টা UID
    const allowedUIDs = [
      "100086599998655",
      "100086331559699"
    ];

    // UID ম্যাচ না করলে কাজ করবে না
    if (!allowedUIDs.includes(senderID)) return;

    // বটের মেসেজ unsend
    api.unsendMessage(messageID);
  };
};

