const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const got = require("got");
const Discord = require("discord.js");
let Jimp = require("jimp");
const levenshtein = require("fast-levenshtein").get;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tti-mc")
    .setDescription(
      "Transforms text into an image made of mc blocks! (BlazeMCworld made the base renderer)"
    )
    .addStringOption((option) =>
      option
        .setName("background")
        .setDescription(
          "Block for background, use block ids. For example: ancient_debris_side, netherite_block"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("textblock")
        .setDescription(
          "Block for text, use block ids. For example: ancient_debris_side, netherite_block"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Text to transform!")
        .setRequired(true)
    ),
  permissions: ["AttachFiles"],
  async execute({ args, member, interaction }) {
    let allblocks = await got(
      "https://api.github.com/repos/InventivetalentDev/minecraft-assets/contents/assets/minecraft/textures/block?ref=1.18"
    ).json();
    let bg = args.background;
    let tc = args.textblock;
    let text = args.text;
    let error;
    try {
      await Jimp.read(
        "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.18/assets/minecraft/textures/block/" +
          bg +
          ".png"
      );
    } catch (e) {
      try {
        let temp = bg.replace(/ /g, "_").toLowerCase();
        await Jimp.read(
          "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.18/assets/minecraft/textures/block/" +
            temp +
            ".png"
        );
      } catch (e) {
        error = "bg";
      }
      if (error == undefined) {
        bg = bg.replace(/ /g, "_").toLowerCase();
      }
    }
    try {
      await Jimp.read(
        "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.18/assets/minecraft/textures/block/" +
          tc +
          ".png"
      );
    } catch (e) {
      try {
        let temp = tc.replace(/ /g, "_").toLowerCase();
        await Jimp.read(
          "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.18/assets/minecraft/textures/block/" +
            temp +
            ".png"
        );
      } catch (e) {
        error = "tc";
      }
      if (error == undefined) {
        tc = tc.replace(/ /g, "_").toLowerCase();
      }
    }
    if (error != undefined) {
      let id;
      let list;
      if (error == "tc") {
        id = tc;
        list = allblocks
          .filter((e) => !e.name.startsWith("_"))
          .map((e) => e.name.replace(/\.png$/, ""))
          .map((e) => ({ name: e, dist: levenshtein(e, tc) }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 10);
        list = list.map((e) => e.name);
      } else if (error == "bg") {
        id = bg;
        list = allblocks
          .filter((e) => !e.name.startsWith("_"))
          .map((e) => e.name.replace(/\.png$/, ""))
          .map((e) => ({ name: e, dist: levenshtein(e, bg) }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 10);
        list = list.map((e) => e.name);
      }
      let msg = "Unknown id '" + id + "', did you mean any of these?";
      for (l of list) {
        msg = msg + "\n- " + l;
      }
      let embed = new EmbedBuilder()
        .setColor(0xFFA500)
        .addFields([
          {
            name: "**ERROR**",
            value: msg,
          },
        ])
        .setFooter({
          text: "Base Renderer by BlazeMCworld || Used NPMs: 'Jimp'",
          url: "https://cdn.discordapp.com/avatars/520308897735639041/9649c6bbec229d695865e965666d6237.png"
        });
      await interaction.editReply({
        content: " ",
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }
    if (bg == tc && member.id == "431069130498637834") {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "You can't enter the same block twice!",
          },
        ])
        .setFooter({
          text: "Base Renderer by BlazeMCworld || Used NPMs: 'Jimp'",
          url: "https://cdn.discordapp.com/avatars/520308897735639041/9649c6bbec229d695865e965666d6237.png"
        });
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
    if (text.length <= 500) {
      let buff = await got(
        "https://untitled-eswsntg31z20.runkit.sh/?bg=" +
          encodeURIComponent(bg) +
          "&tc=" +
          encodeURIComponent(tc) +
          "&text=" +
          encodeURIComponent(text) +
          "&rng=" +
          Date.now()
      ).buffer();
      let tti = await new AttachmentBuilder(buff, { name: "TTI.png" });
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .addFields([
          {
            name: "**Input:**",
            value: args.text,
          },
        ])
        .setImage("attachment://TTI.png")
        .setFooter({
          text: "Base Renderer by BlazeMCworld || Used NPMs: 'Jimp'",
          url: "https://cdn.discordapp.com/avatars/520308897735639041/9649c6bbec229d695865e965666d6237.png"
        });
      await interaction.editReply({
        content: " ",
        embeds: [embed],
        files: [tti],
      });
    } else {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Your text is too long, maximum of 500 letters.",
          },
        ])
        .setFooter({
          text: "Base Renderer by BlazeMCworld || Used NPMs: 'Jimp'",
          url: "https://cdn.discordapp.com/avatars/520308897735639041/9649c6bbec229d695865e965666d6237.png"
        });
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
