const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  async choose({ member, interaction }) {
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
    let role = "<@&" + interaction.values[0] + ">";
    message = message.embeds[0].description.split("\n\n");
    message = message[message.length - 1];
    if (message.includes(role)) {
      interaction.editReply({});
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value: "This role is already assigned to a different emoji!",
        },
      ]);
      interaction.followUp({ content: " ", embeds: [embed], ephemeral: true });
      return;
    }
    let buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("yes")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Success)
      )
      .addComponents(
        new ButtonBuilder().setCustomId("no").setLabel("No").setStyle(ButtonStyle.Danger)
      );
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .setDescription(interaction.message.embeds[0].description + " " + role);
    await interaction.editReply({
      content:
        "**This is your current reaction role message, do you want to add another reaction role?**",
      embeds: [embed],
      components: [buttons],
    });
  },
};
