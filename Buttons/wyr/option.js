const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  async click({ member, interaction }) {
    let message = interaction.message;
    let choose = Number(interaction.customId.replace("option", "")) - 1;
    let embed = message.embeds[0];
    let field;
    if (embed.fields[0] != undefined) {
      field = embed.fields[0].value;
      let options = field.split("\n**Or**\n");
      let option = options[choose];
      embed.fields[0].value = field.replace(option, "__" + option + "__");
    } else {
      field = embed.description;
      let options = field.split("\n**Or**\n");
      let option = options[choose];
      embed.description = field.replace(option, "__" + option + "__");
    }
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      components: [],
    });
  },
};
