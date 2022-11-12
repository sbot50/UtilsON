const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("walrus").setDescription("Walrus."),
  permissions: [],
  async execute({ interaction }) {
    await interaction.editReply({
      content:
        "<:left_eye:854739318077390888><:right_eye:854739318145024080>\n<:left_tooth:854739317846048819><:right_tooth:854739318098362418>",
    });
  },
};
