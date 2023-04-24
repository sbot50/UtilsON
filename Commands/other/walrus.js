const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("walrus").setDescription("Walrus."),
  permissions: [],
  async execute({ interaction }) {
    await interaction.editReply({
      content:
        "<:left_eye:1100096347371225158><:right_eye:1100096352211435560>\n<:left_tooth:1100096350240116908><:right_tooth:1100096354820309082>",
    });
  },
};
