const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Eval command for Bot Devs!")
    .addStringOption((option) =>
      option.setName("code").setDescription("Code to eval.").setRequired(true)
    ),
  permissions: [],
  async execute({ client, args, guild, channel, member, interaction }) {
    let code = args.code;
    let allowedguilds = ["707256948352876585", "677976964535156746"];
    let auth = [
      "305034585941475349",
      "520308897735639041",
      "431069130498637834",
    ];
    if (!auth.includes(member.user.id)) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value: "Only Devs can use this command!",
        },
      ]);
      await interaction.editReply({
        content: " ",
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }
    if (!allowedguilds.includes(guild.id)) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value: "this command only works in the UtilsON dc servers!",
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
    const vm = require("vm");
    let ctx = { ...globalThis };
    let o = [];
    function out(...a) {
      Array.prototype.push.apply(o, a);
    }
    ctx.require = require;
    ctx.console = {
      ...console,
      log: out,
      info: out,
      error: out,
      warn: out,
    };
    ctx.log = out;
    ctx.client = client;
    ctx.channel = channel;
    vm.createContext(ctx);
    try {
      await vm.runInContext(`(async()=>{${code}})()`, ctx);
    } catch (e) {
      o.push(e);
    }
    o = o.map((e) => e + "").join("\n");

    if (o.length > 1000) o = o.substring(o.length - 1000) + "...";

    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Input**",
          value: "```\n" + args.code + "\n```",
        },
      ])
      .addFields([
        {
          name: "**Eval**",
          value: "```\n" + o + "\n```",
        },
      ])
      .setFooter({ text: "Made by: BlazeMCworld" });
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
