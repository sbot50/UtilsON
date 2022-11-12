const Discord = require("discord.js");
const tti = require("../../Commands/image/tti-ai.js");
const { EmbedBuilder } = require("discord.js");

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
            value: "You aren't allowed to change this image!",
          },
        ])
        .setFooter({
          text: "Used Site: 'https://deepai.org/machine-learning-model/text2img'"
        });
      await interaction.followUp({
        content: " ",
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }
    let args = { description: embed.fields[0].value };
    let button = true;
    await tti.execute({ args, interaction, button });
  },
};
