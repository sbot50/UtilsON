const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require("discord.js");
const Discord = require("discord.js");
const got = require("got");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge an x amount of messages from a channel!")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to purge!")
        .setRequired(true)
    ),
  permissions: ["ManageMessages"],
  async execute({ client, args, channel, member, interaction }) {
    if (!member.permissions.has([PermissionsBitField.Flags.Administrator])) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value:
            "You aren't permitted to use this command! You need 'Administrator'",
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
      .setDescription(`Started to purge ${args.amount} messages for you!`);
    args.amount += 1;
    if (args.amount >= 100) {
      args.amount = 100;
    }
    let msgs = await channel.messages.fetch({ limit: args.amount });
    await interaction.editReply({ content: " ", embeds: [embed] });
    msgs = msgs.filter(
      (msg) =>
        msg.interaction == undefined || msg.interaction.id != interaction.id
    );
    let err;
    try {
      await channel.bulkDelete(msgs);
    } catch {
      err = 1;
    }
    if (err == 1) {
      for (let mess of msgs) {
        try {
          await mess[1].delete();
        } catch {}
      }
    }
    embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .setDescription(`The purging process is done!`);
    await interaction
      .editReply({ content: " ", embeds: [embed] })
      .then((message) => {
        setTimeout(function () {
          try {
            message.delete();
          } catch {}
        }, 5000);
      });
  },
};
