const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dcstats")
    .setDescription("Gets this discord server's stats!"),
  permissions: [],
  async execute({ guild, channel, member, interaction }) {
    let name = guild.name;
    let id = guild.id;
    let icon = guild.iconURL();
    let owner = "<@" + guild.ownerId + "> <:Server_Crown_Badge:1098601421269651568>";
    let channels = await guild.channels.fetch();
    let categories = channels.filter(
      (c) => c.type == 4 || c.type == 14
    ).size.toString();
    channels = channels.filter(
      (c) => c.type != 4 && c.type != 14
    ).size.toString();
    let threads = guild.channels.cache.filter(c => c.isThread()).size.toString();
    let members = await guild.members.fetch();
    let humans = members.filter((m) => m.user.bot === false).size.toString();
    let bots = (members.size - humans).toString();
    members = members.size.toString();
    let emojis = guild.emojis.cache.size.toString();
    let roles = Array.from(guild.roles.cache.keys());
    roles = roles.filter((r) => r !== guild.id).map((r) => "<@&" + r + ">");
    if (roles.length > 10) {
      roles = roles.slice(0, 10);
      roles[roles.length - 1] = roles[roles.length - 1] + "...";
    }
    roles = roles.join("\n");
    if (icon != null) {
      icon = icon.replace(".webp", ".png");
    }
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Name**",
          value: name
        },
      ])
      .addFields([
        {
          name: "**Owner**",
          value: owner
        },
      ])
      .addFields([
        {
          name: "**ID**",
          value: id
        },
      ])
      .addFields([
        {
          name: "**Categories**",
          value: categories,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Channels**",
          value: channels,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Threads**",
          value: threads,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Members**",
          value: "" + members,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Humans**",
          value: humans,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Bots**",
          value: bots,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Emojis**",
          value: emojis,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Roles**",
          value: roles,
          inline: true
        },
      ])
    if (icon != null) {
      embed.setThumbnail(icon);
    }
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
