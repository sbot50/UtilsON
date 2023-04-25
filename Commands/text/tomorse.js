const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const morse = require("morse-code-converter");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tomorse")
    .setDescription("Transforms text to morse!")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Text to transform!")
        .setRequired(true)
    ),
  permissions: [],
  async execute({ args, interaction }) {
    let out = await morse.textToMorse(args.text);
    if (out == "") {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Couldn't convert text to morse!",
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
    if (args.text.length > 250) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Maximum text length of 250 characters!",
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
          value: args.text,
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
