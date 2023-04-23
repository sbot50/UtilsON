const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  async click({ client, args, member, interaction }) {
    let message = interaction.message;
    let owner = message.interaction.user.id;
    if (member.user.id != owner) {
      let oldmsg = interaction.message.embeds[0];
      await interaction.editReply({ content: " ", embeds: [oldmsg] });
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "You aren't allowed to change this!",
          },
        ])
      await interaction.followUp({
        content: " ",
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }
    let poll = interaction.message.embeds[0].image.url;
    poll = decodeURIComponent(
      poll.replace("https://quickchart.io/chart?bkg=white&c=", "")
    );
    poll = JSON.parse(poll);
    let embed = interaction.message.embeds[0];
    embed = EmbedBuilder.from(embed);
    embed.setDescription("Do you want to add another option?");
    let buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("choice")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success)
    );
    if (poll.data.datasets.length > 1) {
      buttons.addComponents(
        new ButtonBuilder()
          .setCustomId("channel")
          .setLabel("No")
          .setStyle(ButtonStyle.Danger)
      );
    }
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      components: [buttons],
    });
  },
};
