const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Discord = require("discord.js");
const got = require("got");
const badgeparser = require(`./../../Misc/bte.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dcprofile")
    .setDescription(
      "Gets a discord user's stats for you! (nitro is based on pfp/status emoji)"
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The discord user to get the stats from!")
        .setRequired(true)
    ),
  permissions: ["AttachFiles", "UseExternalEmojis"],
  async execute({ args, guild, member, interaction }) {
    let user = member;
    member = await guild.members.fetch(args.user);
    let joined = "<t:" + Math.floor(member.user.createdAt / 1000) + ":D>";
    let badges = await member.user.fetchFlags();
    console.log(badges);
    badges = badges.toArray();
    let verified;
    if (badges.includes("VerifiedBot")) {
      verified = 1;
      badges.splice(badges.indexOf("VerifiedBot"),1);
    }
    console.log(badges);
    let avatar = member.user.avatarURL();
    let buff;
    let end = ".png";
    if (member.user.avatarURL() != null) {
      let fetched = undefined;
      try {
        fetched = await got(member.user.avatarURL().replace(".webp", ".gif"));
      } catch {}
      if (fetched != undefined && fetched.ok) {
        buff = fetched;
        buff = await Buffer.from(buff);
        avatar = await new AttachmentBuilder(buff, { name: "AVATAR.gif" });
        end = ".gif";
      } else {
        buff = await got(member.user.avatarURL()).buffer();
        avatar = await new AttachmentBuilder(buff, { name: "AVATAR.png" });
      }
    }
    // if (end == ".gif" || (member.presence.activities[0] != undefined && member.presence.activities[0].emoji != null && /[A-z]+/.test(member.presence.activities[0].emoji))) {
    //   badges.push("NITRO")
    // }
    badges = badgeparser.bte(badges);
    let badgelist = badges;
    badges = "";
    for (let badge of badgelist) {
      badges = badges + badge + " ";
    }
    if (badges == "") {
      badges = "None";
    }
    let roles = "";
    let rolecount = 0;
    for (let role of member._roles) {
      rolecount += 1;
      roles = roles + "\n<@&" + role + ">";
      if (rolecount >= 10) {
        roles = roles + "...";
        break;
      }
    }
    let nick = member.nickname;
    let tag = "<@" + member.id + ">";
    if (member.id == guild.ownerId) {
      tag = tag + " <:Server_Crown_Badge:1098601421269651568>";
    }
    if (member.bot) {
      if (verified) {
        tag = tag + " <:VerifiedBot_1:1098608802883969175><:VerifiedBot_2:1098608805283106989>"
      } else {
        tag = tag + " <:Bot_1:1098612594102780036><:Bot_2:1098612596602585129>";
      }
    }
    let id = member.id;
    let orgstatus = member.presence.activities[0];
    let status = "";
    if (orgstatus != undefined) {
      if (orgstatus.name != null && orgstatus.name != "Custom Status") {
        status = status + "\n" + orgstatus.name;
      }
      if (orgstatus.details != null) {
        status = status + "\n" + orgstatus.details;
      }
      if (status != "" && status.state != null) {
        status = status + "\n" + orgstatus.state;
      } else if (status == "") {
        status = orgstatus.state;
      }
      let statusemoji = member.presence.activities[0].emoji;
      if (statusemoji != null) {
        statusemoji = statusemoji.name;
        if (/[A-z]+/.test(statusemoji)) {
          statusemoji = ":" + statusemoji + ":";
        }
        if (status != null && status != undefined) {
          status = statusemoji + " " + status;
        } else {
          status = statusemoji;
        }
      }
      status = "```\n" + status + "\n```";
    } else {
      status = 0;
    }
    let out;
    let embed = new EmbedBuilder().setColor(0x1cd0ce);
    if (nick != null) {
      embed.addFields([
        {
          name: "**Nickname**",
          value: nick,
          inline: true,
        },
      ]);
    }
    embed
      .addFields([
        {
          name: "**Name/Tag**",
          value: tag,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**ID**",
          value: id,
        },
      ]);
    if (badges != "None") {
      embed.addFields([
        {
          name: "**Badges**",
          value: badges,
          inline: true,
        },
      ]);
    }
    if (roles != "") {
      embed.addFields([
        {
          name: "**Roles**",
          value: roles,
          inline: true,
        },
      ]);
    }
    if (status != 0) {
      embed.addFields([
        {
          name: "**Status**",
          value: status,
        },
      ]);
    }
    embed.addFields([
      {
        name: "**Created On**",
        value: joined,
      },
    ]);
    if (avatar != null) {
      embed.setThumbnail("attachment://AVATAR" + end);
    }
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      files: [avatar],
    });
  },
};
