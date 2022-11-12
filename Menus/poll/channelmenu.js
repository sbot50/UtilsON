const Discord = require("discord.js");
const {
  ActionRowBuilder,
  ButtonBuilder,
  PermissionsBitField,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  async choose({ client, guild, member, interaction }) {
    let message = interaction.message;
    let owner = message.interaction.user.id;
    if (member.user.id != owner) {
      let oldmsg = interaction.message.embeds[0];
      await interaction.editReply({ content: " ", embeds: [oldmsg] });
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "You aren't allowed to change this!",
          },
        ])
      await interaction.followUp({
        content: " ",
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }
    let channel = await interaction.message.guild.channels.cache.get(
      interaction.values[0]
    );
    if (
      client.guilds.cache
        .get(guild.id)
        .members.me.permissionsIn(channel)
        .has([
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ViewChannel,
        ])
    ) {
      let embed = interaction.message.embeds[0];
      delete embed.data.description
      let poll = interaction.message.embeds[0].image.url;
      poll = decodeURIComponent(
        poll.replace("https://quickchart.io/chart?bkg=white&c=", "")
      );
      poll = JSON.parse(poll);
      let rows = []
      let buttons = new ActionRowBuilder();
      let datasets = poll.data.datasets;
      let numbers = 0;
      for (let data of datasets) {
        numbers++;
        buttons.addComponents(
          new ButtonBuilder()
            .setCustomId("poll" + numbers)
            .setLabel(data.label)
            .setStyle(ButtonStyle.Primary)
        );
        if (numbers%5 == 0 && numbers != datasets.length) {
          rows.push(buttons);
          buttons = new ActionRowBuilder()
        }
        if (numbers == datasets.length) {
          buttons.addComponents(
            new ButtonBuilder()
              .setCustomId("endpoll")
              .setLabel("End Poll")
              .setStyle(ButtonStyle.Danger)
          );
          rows.push(buttons);
        }
      }
      await channel.send({
        content: " ",
        embeds: [embed],
        components: rows,
      });
      embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .setDescription(
          "**Your poll has been setup and sent to the channel!**"
        );
      await interaction.editReply({
        content: " ",
        embeds: [embed],
        components: [],
      });
    } else {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value:
            "I can't view that channel or am not permitted to send (embedded) messages in that channel.",
        },
      ]);
      await interaction.editReply({});
      await interaction.followUp({
        content: " ",
        embeds: [embed],
        ephemeral: true,
      });
    }
  },
};
