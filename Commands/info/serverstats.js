const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const mcsrv = require("mcsrv");
const Discord = require("discord.js");
const util = require("minecraft-server-util");
const fs = require("fs");
const got = require("got");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstats")
    .setDescription("Gets a minecraft server's stats for you!")
    .addStringOption((option) =>
      option
        .setName("ip")
        .setDescription(
          "IP of the server! (if bedrock, please put in serverip:port)"
        )
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
  integration_types: [0, 1],
  permissions: ["EmbedLinks", "AttachFiles"],
  async execute({ args, interaction, staticmsg }) {
    let err;
    let stats;
    let l = "Unknown";
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
          value: "Something went wrong retrieving server info!",
        },
      ]);
      if (!staticmsg) {
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
      } else {
        let embed = new EmbedBuilder()
          .setColor(0x1cd0ce)
          .setAuthor({
            name: "Unknown",
            iconURL:
              "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/white-circle_26aa.png",
          })
          .addFields([
            {
              name: "**📋Hostname**",
              value: args.ip,
              inline: true,
            },
          ])
          .setDescription(
            "Something went wrong getting information from the server, will try again in 1 minute!"
          );
        return embed;
      }
    }
    err = 0;
    try {
      if (args.bedrock === "Bedrock") {
        l = await util.statusBedrock(stats.ip);
      } else {
        l = await util.status(stats.ip);
      }
    } catch {
      err = 1;
    }
    let latency;
    if (err == 0) {
      l = l.roundTripLatency;
      latency = `${l}ms`;
    } else {
      latency = l;
    }
    let embed = new EmbedBuilder().setColor(0x1cd0ce);
    if (stats.online) {
      embed.setAuthor({
        name: "Online",
        iconURL:
          "https://i.ibb.co/nBL2phn/dbd26c4768e6ce541f5b857b4973226e.png",
      });
    } else {
      embed.setAuthor({
        name: "Offline",
        iconURL:
          "https://i.ibb.co/fX3z6K1/a0a7f6cf67b863940eceaa40397e2030.png",
      });
    }
    if (stats.hostname != undefined) {
      if (args.version == "Bedrock") {
        embed.addFields([
          {
            name: "**📋Hostname**",
            value: args.ip.split(":")[0],
            inline: true,
          },
        ]);
      } else {
        embed.addFields([
          {
            name: "**📋Hostname**",
            value: args.ip,
            inline: true,
          },
        ]);
      }
    }
    embed.addFields([
      {
        name: "**🌐IP**",
        value: stats.ip,
        inline: true,
      },
    ]);
    if (stats.online && args.version != "Bedrock") {
      embed.addFields([
        {
          name: "**⚙️Latency**",
          value: latency,
        },
      ]);
    }
    if (args.version == "Bedrock") {
      embed.addFields([
        {
          name: "**⚙️Port**",
          value: args.ip.split(":")[1],
        },
      ]);
    }
    if (stats.players != undefined) {
      embed.addFields([
        {
          name: "🧑‍🤝‍🧑Players",
          value: stats.players.online + "/" + stats.players.max,
          inline: true,
        },
      ]);
    }
    if (stats.version != undefined || args.bedrock === "Bedrock") {
      let version;
      if (args.bedrock === "Bedrock") {
        version = "Bedrock";
      } else {
        version = stats.version.replace("Requires MC ", "").replace(" / ", "-");
        if (stats.software != undefined && stats.software != "Vanilla") {
          version = stats.software + " " + version;
        }
      }
      embed.addFields([
        {
          name: "📔Version",
          value: version,
          inline: true,
        },
      ]);
    }
    if (
      stats.players != undefined &&
      stats.players.list != undefined &&
      stats.players.list.length > 0
    ) {
      let playerlist = "```\n";
      for (p of stats.players.list) {
        playerlist = playerlist + "- " + p + "\n";
      }
      playerlist = playerlist + "```";
      embed.addFields([
        {
          name: "🕵️Player List",
          value: playerlist,
        },
      ]);
    }
    let files = [];
    if (stats.motd != undefined) {
      let rawmotd = stats.motd.raw;
      let motd = "";
      for (let line in rawmotd) {
        if (line == 0) {
          motd = rawmotd[line];
        } else {
          motd = motd + "\\n" + rawmotd[line];
        }
      }
      let buff = await got(
        "https://sbot50.alwaysdata.net/?text=" +
          encodeURIComponent(motd) +
          "&rng=" +
          Date.now()
      ).buffer();
      let tti = await new AttachmentBuilder(buff, { name: "TTI.png" });
      embed.setImage("attachment://TTI.png");
      files.push(tti);
    }
    if (stats.icon != undefined) {
      let base64 = stats.icon.split(",")[1];
      let thumbnail = new Buffer.from(base64, "base64");
      thumbnail = new AttachmentBuilder(thumbnail, { name: "THUMBNAIL.png" });
      embed.setThumbnail("attachment://THUMBNAIL.png");
      files.push(thumbnail);
    }
    if (!staticmsg) {
      await interaction.editReply({
        content: " ",
        embeds: [embed],
        files: files,
      });
      return;
    } else {
      embed.setThumbnail("attachment://THUMBNAIL.png");
      return [embed, files];
    }
  },
};
