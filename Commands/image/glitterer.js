const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Discord = require("discord.js");
const got = require("got");
const is = require("imagescript");
const webtest = require(`./../../Misc/webtest`);

function rng(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("glitterer")
    .setDescription("Changes a gif or image into a glitter version of itself!")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("Link to the image/gif!")
        .setRequired(true)
    ),
  permissions: ["AttachFiles"],
  async execute({ args, interaction }) {
    let err = 0;
    let link = args.link;
    if (link.endsWith(".webp")) {
      link = link.replace(".webp", ".gif");
      try {
        let res = await timeout(3000, got(link));
        if (res != undefined && res.ok) {
          throw "Error";
        }
      } catch {
        link = link.replace(".gif", ".png");
      }
    }
    let contenttype = await webtest.isimg(link);
    await timeout(3000, got(link)).catch(() => (err = 1));
    if (err == 1 || contenttype == false) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Not a valid URL!",
          },
        ])
        .setFooter({ text: "Used NPMs: 'imagescript'" });
      await interaction
        .editReply({ content: " ", embeds: [embed], ephemeral: true })
        .then((message) => {
          setTimeout(function () {
            try {
              message.delete();
            } catch {}
          }, 5000);
        });
      return;
    }
    let pfp = await timeout(3000, got(link).buffer());
    try {
      pfp = await is.decode(pfp);
    } catch (error) {
      err = 1;
    }
    if (
      err == 1 ||
      (contenttype.includes("png") == false &&
        contenttype.includes("gif") == false)
    ) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value:
              "Unsupported image type! (make sure the link is a direct link to the image/gif)",
          },
        ])
        .setFooter({ text: "Used NPMs: 'imagescript'" });
      await interaction
        .editReply({ content: " ", embeds: [embed], ephemeral: true })
        .then((message) => {
          setTimeout(function () {
            try {
              message.delete();
            } catch {}
          }, 5000);
        });
      return;
    }
    if (pfp.width > 500 || pfp.height > 500) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "That image is too big! (max 500x500)",
          },
        ])
        .setFooter({ text: "Used NPMs: 'imagescript'" });
      await interaction
        .editReply({ content: " ", embeds: [embed], ephemeral: true })
        .then((message) => {
          setTimeout(function () {
            try {
              message.delete();
            } catch {}
          }, 5000);
        });
      return;
    }

    let frames = [];

    if (contenttype.includes("gif")) {
      if (pfp.length > 120) {
        let embed = new EmbedBuilder()
          .setColor(0xa31600)
          .addFields([
            {
              name: "**ERROR**",
              value: "That image is too big! (max 120 frames)",
            },
          ])
          .setFooter({ text: "Used NPMs: 'imagescript'" });
        await interaction
          .editReply({ content: " ", embeds: [embed], ephemeral: true })
          .then((message) => {
            setTimeout(function () {
              try {
                message.delete();
              } catch {}
            }, 5000);
          });
      }
      let actualx = pfp.width - 10;
      let actualy = pfp.height - 10;
      for (let i = 0; i < pfp.length; i++) {
        for (let j = 0; j < 20; j++) {
          let x = rng(10, actualx);
          let y = rng(10, actualy);
          pfp[i].drawBox(x, y, 1, 1, 0xffffffff);
        }
        frames.push(pfp[i]);
      }
    } else {
      for (let i = 0; i < 36; i++) {
        let frame = new is.Frame(
          pfp.width,
          pfp.height,
          100,
          0,
          0,
          is.Frame.DISPOSAL_BACKGROUND
        );
        frame.composite(pfp);
        let actualx = pfp.width - 10;
        let actualy = pfp.height - 10;
        for (let j = 0; j < 20; j++) {
          let x = rng(10, actualx);
          let y = rng(10, actualy);
          frame.drawBox(x, y, 1, 1, 0xffffffff);
        }
        frames.push(frame);
      }
    }
    let gif = new is.GIF(frames);
    gif = await gif.encode(100);
    gif = Buffer.from(gif);
    gif = new AttachmentBuilder(gif, { name: "GIF.gif" });
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .setImage("attachment://GIF.gif")
      .setThumbnail(args.link)
      .setFooter({ text: "Used NPMs: 'imagescript'" });
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      files: [gif],
    });
  },
};
