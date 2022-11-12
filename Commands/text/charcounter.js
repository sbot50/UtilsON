const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("charcounter")
    .setDescription("Counts characters in a text!")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("What text to count from?")
        .setRequired(true)
    ),
  permissions: [],
  async execute({ args, interaction }) {
    let text = args.text.replace(/\\n/g, "");
    let lines = args.text.split(/\\n/g).length;
    let chars = text.length;
    let words = text.split(" ").length;
    let spaces = words - 1;
    let specialchars = 0;
    try {
      specialchars = text.match(/[^\w\d\s]/g).length;
    } catch {}
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Input**",
          value: args.text.replace(/\\n/g, "\n"),
        },
      ])
      .addFields([
        {
          name: "**Words**",
          value: words.toString(),
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Characters**",
          value: chars.toString(),
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Lines**",
          value: lines.toString(),
        },
      ])
      .addFields([
        {
          name: "**Spaces**",
          value: spaces.toString(),
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Special Characters**",
          value: specialchars.toString(),
          inline: true,
        },
      ]);
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
