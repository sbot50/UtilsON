const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactionroles")
    .setDescription("Setup a reaction role message!")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription(
          'The message added to the roles. add "\\n" for a new line.'
        )
        .setRequired(true)
    ),
  permissions: ["ManageMessages", "ManageRoles"],
  async execute({ client, args, member, interaction }) {
    if (
      !member.permissions.has([
        PermissionsBitField.Flags.ManageMessages,
        PermissionsBitField.Flags.ManageRoles,
      ])
    ) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value:
            "You aren't permitted to use this command! You need 'Manage Messages' and 'Manage Roles'",
        },
      ]);
      await interaction
        .editReply({ content: " ", embeds: [embed], ephemeral: true })
        .then((message) => {
          setTimeout(function () {
            try {
              message.delete();
            } catch {}
          }, 5000);
        });
      return;
    }
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .setDescription(args.message.replace(/\\n/g, "\n"));
    let buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success)
    );
    await interaction.followUp({
      content:
        "**This is your current reaction role message, do you want to add another reaction role?**",
      embeds: [embed],
      components: [buttons],
    });
  },
};
