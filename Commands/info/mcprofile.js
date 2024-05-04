const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const errorhandler = require("./../../Misc/weberrorhandler.js");
const got = require("got");
const Discord = require("discord.js");

function timetodate(date) {
  date =
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds() +
    " " +
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " GMT";
  return date;
}

function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mcprofile")
    .setDescription("Gets a minecraft player's stats for you!")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name or UUID of the player!")
        .setRequired(true)
    ),
  integration_types: [0, 1],
  permissions: ["AttachFiles"],
  async execute({ args, interaction }) {
    let uuid;
    let names;
    if (args.name.length > 16) {
      uuid = args.name;
      let err = 0;
      try {
        names = await timeout(
          3000,
          got(`https://api.mojang.com/user/profiles/${args.name}/names`)
        );
      } catch {
        try {
          names = await timeout(
            3000,
            got(`https://api.mojang.com/user/profiles/${args.name}/names`)
          );
        } catch {
          err = 1;
        }
      }
      if (err == 1) {
        let embed = new EmbedBuilder().setColor(0xa31600).addFields([
          {
            name: "**ERROR**",
            value: "Something went wrong, please try again!",
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
      if (names.statusText == "Bad Request") {
        let embed = new EmbedBuilder().setColor(0xa31600).addFields([
          {
            name: "**ERROR**",
            value: "Theres no minecraft player with that UUID!",
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
      names = names.body;
      names = JSON.parse(names);
    } else {
      let err = 0;
      try {
        names = await timeout(
          3000,
          got(`https://api.mojang.com/users/profiles/minecraft/${args.name}`)
        );
      } catch {
        try {
          names = await timeout(
            3000,
            got(`https://api.mojang.com/users/profiles/minecraft/${args.name}`)
          );
        } catch {
          err = 1;
        }
      }
      if (err == 1) {
        let embed = new EmbedBuilder().setColor(0xa31600).addFields([
          {
            name: "**ERROR**",
            value: "Something went wrong, please try again!",
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
      if (names.statusText == "No Content") {
        let embed = new EmbedBuilder().setColor(0xa31600).addFields([
          {
            name: "**ERROR**",
            value: "Theres no minecraft player with that name!",
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
      names = names.body;
      names = JSON.parse(names);
      uuid = names.id;
      err = 0;
      try {
        names = await timeout(
          3000,
          got(`https://api.mojang.com/user/profiles/${names.id}/names`)
        );
      } catch {
        try {
          names = await timeout(
            3000,
            got(`https://api.mojang.com/user/profiles/${names.id}/names`)
          );
        } catch {
          err = 1;
        }
      }
      if (err == 1) {
        let embed = new EmbedBuilder().setColor(0xa31600).addFields([
          {
            name: "**ERROR**",
            value: "Something went wrong, please try again!",
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
      names = await names.body;
      names = JSON.parse(names);
    }
    let pastnames = "```";
    names = names.reverse();
    let name = names[0].name;
    for (let name of names) {
      if (name.changedToAt != undefined) {
        let date = name.changedToAt;
        date = new Date(date);
        date = timetodate(date);
        pastnames = pastnames + "\n" + name.name + " - " + date;
      } else {
        pastnames = pastnames + "\n" + name.name + " - Original Name";
      }
    }
    pastnames = pastnames + "\n```";
    let buff = await got(`https://mc-heads.net/body/${uuid}`).buffer();
    avatar = await new AttachmentBuilder(buff, { name: "AVATAR.png" });
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Name**",
          value: name,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**UUID**",
          value: uuid,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Name History**",
          value: pastnames,
        },
      ])
      .setThumbnail("attachment://AVATAR.png");
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      files: [avatar],
    });
  },
};
