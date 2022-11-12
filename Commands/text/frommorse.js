const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const morse = require("morse-code-converter");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("frommorse")
    .setDescription("Transforms morse to text!")
    .addStringOption((option) =>
      option
        .setName("morse")
        .setDescription("Morse to transform!")
        .setRequired(true)
    ),
  permissions: [],
  async execute({ args, interaction }) {
    let out = await morse.morseToText(args.morse);
    if (out == "") {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Couldn't convert morse to text!",
          },
        ])
        .setFooter({ text: "Used NPM: 'morse-code-converter'" });
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
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Input**",
          value: args.morse,
        },
      ])
      .addFields([
        {
          name: "**Morse**",
          value: out,
        },
      ])
      .setFooter({ text: "Used NPM: 'morse-code-converter'" });
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
