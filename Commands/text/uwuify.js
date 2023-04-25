const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const Uwuifier = require("uwuifier");
const uwuifier = new Uwuifier();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uwuify")
    .setDescription("Uwuifies text!")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("What text needs uwuifying?")
        .setRequired(true)
    ),
  permissions: [],
  async execute({ args, interaction }) {
    if (args.text.length > 1024) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Maximum text length of 1024 characters!",
          },
        ])
        .setFooter({ text: "Used NPM: 'uwuifier'" });
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
    let out = await uwuifier.uwuifySentence(args.text);
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Input**",
          value: args.text,
        },
      ])
      .addFields([
        {
          name: "**UwUified**",
          value: out,
        },
      ])
      .setFooter({ text: "Used NPM: 'uwuifier'" });
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
