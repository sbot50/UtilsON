const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const got = require("got");
const tr = require("googletrans").default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translates some text! (default is to english")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("What text needs translating?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("language_code")
        .setDescription(
          "Into what language do you want it to be translated? (default = english)"
        )
        .setRequired(false)
    ),
  permissions: [],
  async execute({ args, interaction }) {
    let langcode = args.language_code;
    if (langcode == undefined) {
      langcode = "en";
    }
    let out = "";
    try {
      let result = await tr(args.text, langcode);
      out = result.textArray[0];
    } catch (err) {
      out = "";
    }
    if (out == "") {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Something went wrong while translating!",
          },
        ])
        .setFooter({ text: "Used NPM: 'googletrans'" });
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
          name: "**Language Code**",
          value: langcode,
        },
      ])
      .addFields([
        {
          name: "**Translated**",
          value: out,
        },
      ])
      .setFooter({ text: "Used NPMs: 'googletrans'" });
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
