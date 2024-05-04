const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const got = require("got");
const fs = require("fs");
const rngEngine = require("seedrandom");
const chars =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const checklink = require(`./../../Misc/checklink`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wavecollapse")
    .setDescription("Generate an image out of a sample!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("explanation")
        .setDescription("Explanation of how it works")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("generate")
        .setDescription("Generate an image")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("URL of the image")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("tilesize")
            .setDescription("How big the tiles are (defaults to 5)")
            .setRequired(false)
        )
    ),
  integration_types: [0, 1],
  permissions: ["EmbedLinks", "AttachFiles"],
  async execute({ client, args, member, interaction, db }) {
    let sub = interaction.options._subcommand;
    if (sub == "explanation") {
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .setDescription(
          "I suggest you open this image in your browser (or download it) so you can zoom in!"
        )
        .setImage("https://imgur.com/a/azSLNYw")
        .setFooter({ text: "Used Algorithm: 'Wave Collapse'" });
      await interaction.editReply({ content: " ", embeds: [embed] });
    } else {
      if (!checklink.islink(args.url)) {
        let embed = new EmbedBuilder()
          .setColor(0xa31600)
          .addFields([
            {
              name: "**ERROR**",
              value: "The image link isn't valid!",
            },
          ])
          .setFooter({ text: "Used Algorithm: 'Wave Collapse'" });
        interaction
          .editReply({ content: " ", embeds: [embed], ephemeral: true })
          .then((message) => {
            setTimeout(function () {
              try {
                message.delete();
              } catch {}
            }, 5000);
          });
      }
      let img = encodeURIComponent(args.url);
      let tlz = args.tilesize;
      if (!tlz) {
        tlz = 5;
      }
      if (!db.has("wavecollapse")) {
        await db.set("wavecollapse", {});
      }
      let list = await db.get("wavecollapse");
      if (list == undefined) {
        list = [];
      }
      let rng = rngEngine(Date.now() + "");
      let rand;
      while (true) {
        rand = "";
        for (let i = 0; i < 10; i++) {
          rand += chars[Math.floor(rng.quick() * chars.length)];
        }
        if (!db.has(rand)) {
          break;
        }
      }
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .addFields([
          {
            name: "**Status**",
            value: "Started...",
          },
        ])
        .setThumbnail(args.url)
        .setFooter({ text: "Used Algorithm: 'Wave Collapse'" });
      await interaction.editReply({ content: " ", embeds: [embed] });
      let msgs = await client.guilds.cache
        .get(interaction.guildId)
        .channels.cache.get(interaction.channelId)
        .messages.fetch({ limit: 1 });
      msgs = await msgs
        .filter((message) => message.interaction.id == interaction.id)
        .map((message) => message.id);
      list[rand] = await client.guilds.cache
        .get(interaction.guildId)
        .channels.cache.get(interaction.channelId)
        .messages.fetch(msgs[0]);
      await db.set("wavecollapse", list);

      // let endpoint = "https://untitled-1xa8qda86lqk.runkit.sh/"; //old
      let endpoint =
        "https://hf.space/embed/CodeON/WaveCollapse-Image-Generation/+/"; //workers
      // let endpoint = "https://WaveCollapse-Image-Generation.sbot50.repl.co/" //repl
      // worker source: https://runkit.com/blazemcworld/6197906173890800089d7e7f

      let prog = encodeURIComponent(
        `https://hf.space/embed/CodeON/UtilsON/+/wc/?id=${rand}`
      );
      console.log(`${endpoint}?tlz=${tlz}&img=${img}&prog=${prog}`);
      await got(`${endpoint}?tlz=${tlz}&img=${img}&prog=${prog}`);
    }
  },
};
