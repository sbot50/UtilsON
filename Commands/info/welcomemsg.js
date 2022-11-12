const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcomemsg")
    .setDescription("setup a welcome message for your server!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set the welcome message to your server")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel the messages will appear in.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("placeholders")
        .setDescription("Shows you all placeholders.")
    ),
  permissions: [],
  async execute({ client, args, member, interaction, db }) {
    if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value:
            "You aren't permitted to use this command! You need 'Manege Messages'",
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
    let sub = interaction.options._subcommand;
    let guild = await client.guilds.cache.get(interaction.guildId);
    let size = await guild.memberCount;
    if (sub == "placeholders") {
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .setDescription(
          "**{usertag}** = UtilsON#3057\n**{ping}** = <@717030572622610472>\n**{servername}** = " +
            guild.name +
            "\n**{members}** = " +
            size +
            "\nIf you need anything else not on this list, ill add it: <@305034585941475349>"
        );
      await interaction.editReply({ content: " ", embeds: [embed] });
    } else {
      let out = "**Set the welcomemsg to:** *" + args.message + "*";
      let values = await db.get(guild.id);
      if (values == undefined) {
        values = {};
      }
      values.welcomemsg = args.message;
      if (args.channel != undefined) {
        let channel = await client.guilds.cache
          .get(interaction.guildId)
          .channels.cache.get(args.channel);
        if (channel.type == "GUILD_TEXT") {
          values.welcomechannel = args.channel;
          out = out + "\n**Channel was set to:** <#" + args.channel + ">";
        } else {
          out = out + "\n**Invalid Channeltype choosen!**";
        }
      } else {
        if (values.welcomechannel == undefined) {
          out = out + "\n**No Channel set!**";
        } else {
          out = out + "\n**Channel is:** <#" + values.welcomechannel + ">";
        }
      }
      await db.set(guild.id, values);
      let embed = new EmbedBuilder().setColor(0x1cd0ce).setDescription(out);
      await interaction.editReply({ content: " ", embeds: [embed] });
    }
  },
};
