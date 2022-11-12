const Discord = require("discord.js");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  async click({ guild, member, interaction }) {
    let channel = await guild.channels.fetch(interaction.channelId);
    if (
      !member
        .permissionsIn(channel)
        .has([PermissionsBitField.Flags.ManageMessages])
    ) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value:
            "You aren't permitted to use that button. (need ManageMessages)",
        },
      ]);
      await interaction.editReply({});
      await interaction.followUp({
        content: " ",
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }
    interaction.editReply({ components: [] });
  },
};
