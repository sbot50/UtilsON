const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Discord = require("discord.js");
const https = require("https");
const got = require("got");
const gis = require('async-g-i-s');
let cache = new Map();

const agent = new https.Agent({
  rejectUnauthorized: false,
});

function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
}

// async function addmap(results, query) {
//   let promises = [];
//   let valid = 0
//   let invalid = 0;
//   console.log("Checking validity...")
//   for (let r of results) {
//     try {
//       let p = timeout(3000, got(r.url));
//       promises.push(p);
//     } catch {}
//   }
//   results = await Promise.allSettled(promises);
//   console.log("Validity Checked!")
//   let reslist = [];
//   console.log("Pushing to map...")
//   for (let r of results) {
//     if (r.status == "fulfilled" && r.value != undefined && r.value.statusCode == 200) {
//       reslist.push(r.value.url);
//       valid += 1;
//     } else {
//       invalid += 1;
//     }
//   }
//   console.log("Valid: " + valid + "\nInvalid: " + invalid + "\nTotal: " + results.length)
//   console.log("Mapped!")
//   cache.set(query, reslist);
// }

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Searches for an image on google!")
    .addStringOption((option) =>
      option
        .setName("searchquery")
        .setDescription("Text to search for!")
        .setRequired(true)
    ),
  permissions: ["EmbedLinks"],
  async execute({ args, skips, interaction, button }) {
    if (button == undefined) button = false;
    if (button) {
      let components = interaction.message.components;
      for (component in components[0].components) {
        comp = components[0].components[component];
        comp = ButtonBuilder.from(comp).setDisabled(true);
        components[0].components[component] = comp;
      }
      let oldmsg = interaction.message.embeds[0];
      await interaction.editReply({
        content: " ",
        embeds: [oldmsg],
        components: components,
      });
    }
    if (typeof skips != "number") {
      skips = 0;
    }
    if (cache.has(args.searchquery)) {
      let cached = cache.get(args.searchquery);
      let res,index = skips;
      while (index < cached.length - 1) {
        let url = cached[i].url
        try {
          res = await timeout(5000, got(url));
        } catch {}
        if (res) {
          res = url;
          break;
        } else {
          delete cached[i]
        }
      }
      if (skips > cached.length - 1 || !res) {
        let oldmsg = interaction.message.embeds[0];
        await interaction.editReply({ content: " ", embeds: [oldmsg] });
        let embed = new EmbedBuilder()
          .addFields([
            { name: "**ERROR**", value: "Max image fetch limit reached!" },
          ])
          .setFooter({ text: "Used NPMs: 'g-i-s'" });
        await interaction
          .followUp({ content: " ", embeds: [embed], ephemeral: true })
          .then((message) => {
            setTimeout(function () {
              try {
                message.delete();
              } catch {}
            }, 5000);
          });
        return;
      }
      let row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("previous")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Danger)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next")
            .setStyle(ButtonStyle.Success)
        );
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .addFields([
          {
            name: "**SearchQuery**",
            value: args.searchquery,
          },
        ])
        .setImage(res)
        .setFooter({text: "Page: " + (skips + 1) + " || Used NPMs: 'g-i-s'"});
      await interaction.editReply({
        content: " ",
        embeds: [embed],
        components: [row],
      });
      return;
    }
    let results,error;
    console.log("Getting Images...")
    try {
      results = await gis(args.searchquery)
    } catch {
      error = 1
    }
    if (error || results.length == 0) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Couldn't find any great matches for your searchquery.",
          },
        ])
        .setFooter({ text: "Used NPMs: 'g-i-s'" });
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
    results.splice(11)
    console.log("Got Images!")
    console.log("Getting First valid...")
    let firstres;
    let amount = skips;
    for (let r of results) {
      let res;
      let err = 0;
      try {
        res = await timeout(3000, got(r.url));
      } catch {
        err = 1;
      }
      if (
        error != 1 &&
        amount == 0 &&
        res != undefined &&
        res.statusCode == 200
      ) {
        firstres = r.url;
        break;
      } else {
        if (
          amount > 0 &&
          error != 1 &&
          res != undefined &&
          res.statusCode == 200
        ) {
          amount -= 1;
        }
      }
    }
    console.log("Gotten first image...")
    //await addmap(results, args.searchquery);
    cache.set(args.searchquery, results);
    let row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("Previous")
          .setStyle(ButtonStyle.Danger)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle(ButtonStyle.Success)
      );
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**SearchQuery**",
          value: args.searchquery,
        },
      ])
      .setImage(firstres)
      .setFooter({ text: "Page: " + (skips + 1) + " || Used NPMs: 'g-i-s'" });
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      components: [row],
    });
  },
  isCached(query) {
    return cache.has(query);
  },
};
