const Discord = require("discord.js");
const tti = require("../../Commands/text/acronymguesser.js");

module.exports = {
  async click({ member, interaction }) {
    let message = interaction.message;
    let embed = message.embeds[0];
    let owner = message.interaction.user.id;
    if (member.user.id != owner) {
      await interaction.editReply({});
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "You aren't allowed to change this image!",
          },
        ])
        .setFooter({ text: "Used NPM: 'acronymresolver'" });
      await interaction.followUp({
        content: " ",
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }
    let args = { acronym: embed.fields[0].value };
    await tti.execute({ args, interaction });
  },
};
