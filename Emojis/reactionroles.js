const Discord = require("discord.js");
const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
let emotes = JSON.parse(fs.readFileSync("./Misc/emojis.json", "utf-8")).emojis;

module.exports = {
  async react({ emoji, user, message, member, reaction }) {
    let interaction = message.interaction;
    let owner = message.interaction.user.id;
    if (member.user.id != owner) {
      let oldmsg = interaction.message.embeds[0];
      await interaction.editReply({ content: " ", embeds: [oldmsg] });
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "You aren't allowed to change this!",
          },
        ])
      await interaction.followUp({
        content: " ",
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }
    await message.reactions.resolve(reaction).users.remove(user);
    let msg = reaction.message;
    msg = msg.embeds[0].description.split("\n\n");
    msg = msg[msg.length - 1];
    if (msg.includes(emoji)) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value: "This emoji is already assigned to a different role!",
        },
      ]);
      reaction.message.channel
        .send({ content: " ", embeds: [embed], ephemeral: true })
        .then((message) => {
          setTimeout(function () {
            try {
              message.delete();
            } catch {}
          }, 5000);
        });
      return;
    }
    let options = [];
    await message.guild.roles.cache.forEach((role) => {
      if (role.name != "@everyone") {
        let option = {};
        option.label = role.name;
        option.description = "​";
        option.value = role.id + "";
        options.push(option);
      }
    });
    let menus = [];
    var i,
      j,
      temporary,
      chunk = 25;
    for (i = 0, j = options.length; i < j; i += chunk) {
      temporary = options.slice(i, i + chunk);
      let menu = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("rolemenu" + i)
          .setPlaceholder("Please select a role!")
          .addOptions(temporary)
      );
      menus.push(menu);
    }
    let space = "\n";
    if (message.embeds[0].description == "​") {
      space = "";
    } else if (
      emotes.filter((w) => message.embeds[0].description.includes(w)).length ==
        0 &&
      !/<:[0-9]+:>/u.test(message.embeds[0].description)
    ) {
      space = "\n\n";
    }
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .setDescription(message.embeds[0].description + space + emoji + " = ");
    message.edit({
      content: "**Please select the role you want the emoji to represent!**",
      embeds: [embed],
      components: menus,
    });
  },
};
