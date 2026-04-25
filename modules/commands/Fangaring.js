module.exports.config = {
    name: "fingering",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "D-Jukie (Fixed by Gemini)",
    description: "শান্তি শান্তি! প্রোফাইল পিকচার দিয়ে এডিট করা ছবি তৈরি করুন",
    commandCategory: "fun",
    usages: "[mention/reply]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const jimp = require("jimp");
    const { threadID, messageID, senderID, mentions, type, messageReply } = event;

    // ১. টার্গেট ইউজার আইডি বের করা
    let targetID;
    if (type == "message_reply") {
        targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
    } else {
        return api.sendMessage("uffs শান্তি শান্তি... শরীরটা ঠান্ডা করতে একজনকে মেনশন দিন ! 🤤😜", threadID, messageID);
    }

    try {
        const pathImg = __dirname + `/cache/fingering_${senderID}_${targetID}.png`;
        const pathAvt1 = __dirname + `/cache/avt1_${senderID}.png`;
        const pathAvt2 = __dirname + `/cache/avt2_${targetID}.png`;

        // ২. টেম্পলেট এবং ফেসবুক প্রোফাইল পিকচার ইউআরএল
        const templateURL = "https://i.imgur.com/KRTf6Tu.jpeg"; 
        const avtURL1 = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const avtURL2 = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        // ৩. ছবিগুলো ডাউনলোড করা
        const [resAvt1, resAvt2, resTemp] = await Promise.all([
            axios.get(avtURL1, { responseType: "arraybuffer" }),
            axios.get(avtURL2, { responseType: "arraybuffer" }),
            axios.get(templateURL, { responseType: "arraybuffer" })
        ]);

        fs.writeFileSync(pathAvt1, Buffer.from(resAvt1.data, "utf-8"));
        fs.writeFileSync(pathAvt2, Buffer.from(resAvt2.data, "utf-8"));
        fs.writeFileSync(pathImg, Buffer.from(resTemp.data, "utf-8"));

        // ৪. Jimp দিয়ে এডিটিং শুরু
        let baseImage = await jimp.read(pathImg);
        let img1 = await jimp.read(pathAvt1); // আপনার ছবি
        let img2 = await jimp.read(pathAvt2); // যার ছবি এডিট করবেন

        // প্রোফাইল ফটো গোল করা
        img1.circle();
        img2.circle();

        // ছবির সাইজ ঠিক করা (টেম্পলেট অনুযায়ী ১৬০x১৬০)
        img1.resize(160, 160); 
        img2.resize(160, 160);

        // টেম্পলেটের নির্দিষ্ট জায়গায় ছবিগুলো বসানো
        baseImage.composite(img1, 340, 120); // ডান দিকে আপনার ছবি
        baseImage.composite(img2, 100, 220); // বাম দিকে মেনশন দেওয়া ব্যক্তির ছবি

        await baseImage.writeAsync(pathImg);

        // ৫. ফলাফল পাঠানো
        return api.sendMessage({
            body: "শান্তি শান্তি শান্তি... শরীরটা ঠান্ডা হয়ে গেল! 🤤😜",
            attachment: fs.createReadStream(pathImg)
        }, threadID, () => {
            // ক্যাশ ফাইল মুছে ফেলা
            if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
            if (fs.existsSync(pathAvt1)) fs.unlinkSync(pathAvt1);
            if (fs.existsSync(pathAvt2)) fs.unlinkSync(pathAvt2);
        }, messageID);

    } catch (err) {
        console.error(err);
        return api.sendMessage("ইমেজ জেনারেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন!", threadID, messageID);
    }
};
