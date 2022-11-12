const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const got = require("got");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tti")
    .setDescription(
      "Transforms text into an image! (BlazeMCworld made the base text renderer)"
    )
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription(
          "Text to transform! (BlazeMCworld made the base text renderer)"
        )
        .setRequired(true)
    ),
  permissions: ["AttachFiles"],
  async execute({ args, interaction }) {
    let text = args.text;
    if (text.length <= 500 && text.includes("your mom") == false) {
      let buff = await got(
        "https://hf.space/embed/CodeON/Text-To-Image/+/?text=" +
          encodeURIComponent(text) +
          "&rng=" +
          Date.now()
      ).buffer();
      let tti = await new AttachmentBuilder(buff, { name: "TTI.png" });
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .addFields([
          {
            name: "**Input:**",
            value: args.text,
          },
        ])
        .setImage("attachment://TTI.png")
        .setFooter({
          text: "Base Text Render by BlazeMCworld || Used NPMs: 'canvas, twemoji-parser'",
          url: "https://cdn.discordapp.com/avatars/520308897735639041/9649c6bbec229d695865e965666d6237.png"
        });
      await interaction.editReply({
        content: " ",
        embeds: [embed],
        files: [tti],
      });
    } else {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Your text is too long, maximum of 500 letters.",
          },
        ])
        .setFooter({
          text: "Base Text Render by BlazeMCworld || Used NPMs: 'canvas, twemoji-parser'",
          url: "https://cdn.discordapp.com/avatars/520308897735639041/9649c6bbec229d695865e965666d6237.png"
        });
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
  },
};
