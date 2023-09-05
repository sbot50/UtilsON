const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  async click({ member, interaction }) {
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
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .setDescription(interaction.message.embeds[0].description);
    interaction.editReply({
      content:
        "**Please react with the emoji you want your role to represent!**",
      embeds: [embed],
      components: [],
    });
  },
};
