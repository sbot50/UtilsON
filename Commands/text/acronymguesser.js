const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Discord = require("discord.js");
const acronymResolver = require("acronymresolver");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("acronymguesser")
    .setDescription("Guesses what the acronym stands for!")
    .addStringOption((option) =>
      option
        .setName("acronym")
        .setDescription("The acronym to guess!")
        .setRequired(true)
    ),
  permissions: [],
  async execute({ args, interaction }) {
    if (args.acronym.length > 25) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Maximum of 25 characters!",
          },
        ])
        .setFooter({ text: "Used NPM: 'acronymresolver'" });
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
    if (!args.acronym.match(/^[A-Za-z ]+$/)) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Acronym needs to consist of only letters!",
          },
        ])
        .setFooter({ text: "Used NPM: 'acronymresolver'" });
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
    let out = await acronymResolver(args.acronym);
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Input**",
          value: args.acronym,
        },
      ])
      .addFields([
        {
          name: "**Guessed**",
          value: out,
        },
      ])
      .setFooter({ text: "Used NPM: 'acronymresolver'" });
    let button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("refresh")
        .setEmoji("🔄")
        .setStyle(ButtonStyle.Primary)
    );
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      components: [button],
    });
  },
};
