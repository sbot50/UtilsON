const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Discord = require("discord.js");
const got = require("got");
const is = require("imagescript");
const webtest = require(`./../../Misc/webtest`);
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("animatedtyping")
    .setDescription("Adds a typing animation for your inputted text!")
    .addStringOption((option) =>
      option.setName("text").setDescription("Text to animate").setRequired(true)
    ),
  permissions: ["AttachFiles"],
  async execute({ args, interaction }) {
    let text = args.text;
    let string = "";
    let frames = [];
    let promises = [];
    if (text.length > 50) {
      await interaction.editReply({
        content: "Too long text! (" + text.length + ">50)",
      });
      return;
    }
    for (var i = 0; i < text.length; i++) {
      string = string + text[i];
      promises.push(
        (async () => {
          let img = await got(
            "https://sbot50.alwaysdata.net/?text=" +
              encodeURIComponent(string) +
              "&rng=" +
              Date.now()
          ).buffer();
          img = await is.decode(img);
          let frame = new is.Frame(img.width, img.height);
          frame.composite(img);
          return frame;
        })()
      );
    }
    frames = await Promise.all(promises);
    console.log(frames);
    let gif = new is.GIF(frames);
    gif = await gif.encode(100);
    gif = Buffer.from(gif);
    gif = new AttachmentBuilder(gif, { name: "GIF.gif" });
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Input**",
          value: text,
        },
      ])
      .setImage("attachment://GIF.gif")
      .setFooter({ text: "Used NPMs: 'imagescript'" });
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      files: [gif],
    });
  },
};
