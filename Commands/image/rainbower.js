const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const Discord = require("discord.js");
const got = require("got");
const is = require("imagescript");
const webtest = require(`./../../Misc/webtest`);
const fs = require("fs");

function makeid(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
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
    .setName("rainbower")
    .setDescription("Changes a gif or image into a rainbow version of itself!")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("Link to the image/gif!")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("speed")
        .setDescription(
          "Speed Multiplier (up to 3x, only works for images, not gifs"
        )
        .setRequired(false)
    ),
  integration_types: [0, 1],
  permissions: ["AttachFiles"],
  async execute({ args, interaction }) {
    let err = 0;
    let link = args.link;
    let speed = args.speed;
    if (speed == undefined || speed < 0 || speed > 3) {
      speed = 1;
    }
    if (link.endsWith(".webp")) {
      link = link.replace(".webp", ".gif");
      try {
        let res;
        try {
          res = await timeout(3000, got(link));
        } catch {}
        if (res != undefined && res.ok) {
          throw "Error";
        }
      } catch {
        link = link.replace(".gif", ".png");
      }
    }
    try {
      await timeout(3000, got(link)).catch(() => (err = 1));
    } catch {
      err = 1;
    }
    if (err == 1) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Took too long to get the image!",
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
    let contenttype = await webtest.isimg(link);
    if (contenttype == false) {
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
    let pfp;
    try {
      pfp = await timeout(3000, got(link).buffer());
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
    if (pfp.width > 1000 || pfp.height > 1000) {
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
              value: "That gif is too big! (max 120 frames)",
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
      let hueamount = 360 / pfp.length;
      for (let i = 0; i < pfp.length; i++) {
        let actualhueamount = hueamount * (i + 1);
        pfp[i].hueShift(actualhueamount);
        frames.push(pfp[i]);
      }
    } else {
      let frameamount = 36 / speed;
      let shiftamount = 10 * speed;
      for (let i = 0; i < frameamount; i++) {
        let frame = new is.Frame(pfp.width, pfp.height);
        frame.composite(pfp);
        pfp.hueShift(shiftamount);
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
      .setThumbnail(link)
      .setFooter({ text: "Used NPMs: 'imagescript'" });
    if (!contenttype.includes("gif")) {
      embed.addFields([
        {
          name: "**Speed Multiplier**",
          value: speed + "x",
        },
      ]);
    }
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      files: [gif],
    });
  },
};
