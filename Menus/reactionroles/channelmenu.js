const Discord = require("discord.js");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField,
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
    let desc = message.embeds[0].description;
    message = message.embeds[0].description.split("\n\n");
    message = message[message.length - 1];
    message = message.split("\n");
    let split = [];
    for (m of message) {
      split.push(m.split(" = ")[0]);
      split.push(m.split(" = ")[1]);
    }
    let buttons = [];
    let button = new ActionRowBuilder();
    let epr = Math.ceil(split.length / 2 / Math.ceil(split.length / 2 / 5));
    for (s in split) {
      // if (split[s].match(/<@&[0-9]+>/) && !/\p{Emoji}/u.test(split[s])) {
      //   console.log(split[s])
      //   continue;
      // }
      s = Number(s);
      if ((s + 1) % 2 == 0) {
        continue;
      }
      let emoji = split[s];
      if (emoji.match(/<:[A-z]+:[0-9]+>/)) {
        emoji = emoji.replace(/<:[A-z]+:/, "").replace(">", "");
      }
      button.addComponents(
        new ButtonBuilder()
          .setCustomId("role" + split[++s].replace("<@&", "").replace(">", ""))
          .setEmoji(emoji)
          .setStyle(ButtonStyle.Success)
      );
      if (button.components.length == epr || s == split.length - 1) {
        buttons.push(button);
        button = new ActionRowBuilder();
      }
    }
    if (
      client.guilds.cache
        .get(guild.id)
        .members.me.permissionsIn(channel)
        .has([
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ViewChannel,
        ])
    ) {
      let embed = new EmbedBuilder().setColor(0x1cd0ce).setDescription(desc);
      await channel.send({
        content: " ",
        embeds: [embed],
        components: buttons,
      });
      embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .setDescription(
          "**Your reaction role message has been setup and sent to the channel!**"
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
