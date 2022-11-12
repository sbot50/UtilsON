const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  ActionRowBuilder,
  ButtonBuilder,
  PermissionsBitField,
} = require("discord.js");
const Discord = require("discord.js");
const mcsrv = require("mcsrv");
const got = require("got");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("staticserverstats")
    .setDescription(
      "Make a static minecraft server stat message! (will update every minute)"
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel the message will be in!")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("ip")
        .setDescription("IP of the minecraft server!")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("version")
        .setDescription(
          "What version is the server on? (Java is selected if not specified)"
        )
        .setRequired(false)
        .addChoices(
          { name: "Java", value: "Java" },
          { name: "Bedrock", value: "Bedrock" }
        )
    ),
  permissions: ["AttachFiles", "EmbedLinks"],
  async execute({ client, args, guild, member, interaction, db }) {
    if (
      !member.permissions.has([
        PermissionsBitField.Flags.ManageMessages,
        PermissionsBitField.Flags.ManageChannels,
      ])
    ) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value:
            "You aren't permitted to use this command! You need 'Manage Messages' and 'Manage Channels'",
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
    let channel = await guild.channels.cache.get(args.channel);
    if (channel.type != 0) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value: "This isn't a valid text channel!",
        },
      ]);
      await interaction
        .editReply({
          content: " ",
          embeds: [embed],
          ephemeral: true,
        })
        .then((message) => {
          setTimeout(function () {
            try {
              message.delete();
            } catch {}
          }, 5000);
        });
      return;
    }
    let err, stats;
    try {
      if (args.version == "Bedrock") {
        stats = await got(
          `https://api.mcsrvstat.us/bedrock/2/${args.ip}`
        ).json();
      } else {
        stats = await got(`https://api.mcsrvstat.us/2/${args.ip}`).json();
      }
    } catch (error) {
      err = 1;
    }
    if (err == 1 || stats == undefined || stats.ip == "127.0.0.1") {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value: "This isn't a valid minecraft ip adress!",
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
    if (
      client.guilds.cache
        .get(guild.id)
        .members.me.permissionsIn(channel)
        .has([
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ViewChannel,
        ])
    ) {
      let staticmsg = true;
      let getstats = require("./../../Commands/info/serverstats.js");
      let embed = await getstats.execute({ args, staticmsg });
      let msg;
      await channel
        .send({ content: " ", embeds: [embed[0]], files: embed[1] })
        .then((message) => {
          msg = message;
        });
      embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .setDescription(
          "Your static message has been send and will be edited every minute!"
        );
      await interaction.editReply({
        content: " ",
        embeds: [embed],
        components: [],
      });
      console.log(guild.id);
      let values = await db.get(guild.id);
      console.log(values);
      if (values == undefined) {
        values = {};
      }
      if (values.staticmcstats == undefined) {
        values.staticmcstats = [];
      }
      values.staticmcstats.push(msg);
      await db.set(guild.id, values);
      await db.save();
      await db.load();
    } else {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value:
            "I can't view that channel or am not permitted to send (embedded) messages in that channel.",
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
    }
  },
};
