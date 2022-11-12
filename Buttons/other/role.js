const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  async click({ guild, member, interaction }) {
    let roleId = interaction.customId.replace("role", "");
    let role = guild.roles.cache.get(roleId);
    if (member.roles.cache.has(roleId)) {
      member.roles.remove(role);
      await interaction.editReply({});
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .setDescription(`**Removed <@&${roleId}> role!**`);
      interaction.followUp({ content: " ", embeds: [embed], ephemeral: true });
    } else {
      member.roles.add(role);
      await interaction.editReply({});
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .setDescription(`**You now have <@&${roleId}> role!**`);
      interaction.followUp({ content: " ", embeds: [embed], ephemeral: true });
    }
  },
};
