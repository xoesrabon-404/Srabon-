module.exports = function ({ api }) {
  return function ({ event }) {
    const { senderID, reaction, messageID } = event;

    // শুধু 😡 রিয়্যাকশন হলে
    if (reaction !== "😡") return;

    // শুধু এই ২টা অ্যাডমিন UID
    const adminUIDs = [
      "100086599998655",
      "100086331559699"
    ];

    // এই UID না হলে কাজ করবে না
    if (!adminUIDs.includes(String(senderID))) return;

    // বটের মেসেজ আনসেন্ড
    api.unsendMessage(messageID);
  };
};
