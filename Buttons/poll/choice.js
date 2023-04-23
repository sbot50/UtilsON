const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  dontDefer: true,
  async click({ client, args, member, interaction }) {
    let message = interaction.message;
    let owner = message.interaction.user.id;
    if (member.user.id != owner) {
      let oldmsg = interaction.message.embeds[0];
      await interaction.deferUpdate();
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
    let modal = new ModalBuilder()
      .setCustomId("choice")
      .setTitle("Add choice");

    let title = new TextInputBuilder()
      .setCustomId("title")
      .setLabel("Name of the choice")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    let hex = new TextInputBuilder()
      .setCustomId("hex")
      .setLabel("Color of the option. (hex, no alpha support)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMinLength(6)
      .setMaxLength(7)

    let titleInput = new ActionRowBuilder().addComponents(title);
    let hexInput = new ActionRowBuilder().addComponents(hex);
    modal.addComponents(titleInput,hexInput);
    interaction.showModal(modal);
  },
};
