module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "1.0.1",
  credits: "rX Abdullah",
  description: "Auto add user back silently if they leave (antiout system)"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  const threadData = await Threads.getData(event.threadID) || {};
  const data = threadData.data || {};

  // ডিফল্টভাবে Anti-Out চালু
  if (data.antiout === undefined) data.antiout = true;

  // যদি মোড বন্ধ থাকে, কিছু করবে না
  if (data.antiout !== true) return;

  // বট নিজে ছাড়লে কিছু করবে না
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  // যিনি গ্রুপ ছাড়েন, তার নিজস্ব ছাড়া হলে
  if (event.author == event.logMessageData.leftParticipantFbId) {
    try {
      await api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID);
      // কোনো মেসেজ পাঠানো হবে না
    } catch (err) {
      // এরর হলেও গ্রুপে কোনো নোটিশ যাবে না
    }
  }
};
