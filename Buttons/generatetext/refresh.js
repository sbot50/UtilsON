const Discord = require("discord.js");
const gen = require("../../Commands/text/generatetext.js");

module.exports = {
  async click({ member, interaction }) {
    let message = interaction.message;
    let embed = message.embeds[0];
    let owner = message.interaction.user.id;
    if (member.user.id != owner) {
      let oldmsg = interaction.message.embeds[0];
      await interaction.editReply({ content: " ", embeds: [oldmsg] });
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "You aren't allowed to change this text!",
          },
        ])
        .setFooter(
          "Used Site: 'https://deepai.org/machine-learning-model/text-generation'"
        );
      await interaction.followUp({
        content: " ",
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }
    let args = { string: embed.description.split(/\*\*/g)[1] };
    let button = true;
    await gen.execute({ args, interaction, button });
  },
};
