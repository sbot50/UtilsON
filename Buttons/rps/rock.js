const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  async click({ member, interaction }) {
    let message = interaction.message;
    let embed = message.embeds[0];
    let owner = message.interaction.user.id;
    if (member.user.id != owner) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value: "You didn't start this rps match!",
        },
      ]);
      interaction.editReply({ content: " ", embeds: [embed], ephemeral: true });
      return;
    }
    let field = embed.fields[2];
    if (field != undefined && field.value == "Waiting for you...") {
      (async () => {
        let rand = ["🪨", "📰", "✂️"];
        rand = rand[Math.floor(Math.random() * rand.length)];
        function you(embed) {
          let val = embed.fields[1].value;
          val = val.split("/");
          val = JSON.parse(val[0]);
          val++;
          embed.fields[1].value = val + "/3";
          return embed;
        }
        function bot(embed) {
          let val = embed.fields[0].value;
          val = val.split("/");
          val = JSON.parse(val[0]);
          val++;
          embed.fields[0].value = val + "/3";
          return embed;
        }
        if (rand == "🪨") {
          embed.fields[2].value =
            "You chose: " + rand + "\nBot choose: " + rand + "\nTie!";
        } else {
          if (rand == "✂️") {
            embed = await you(embed);
            embed.fields[2].value =
              "You chose: 🪨\nBot choose: " + rand + "\nYou won!";
          } else if (rand == "📰") {
            embed = await bot(embed);
            embed.fields[2].value =
              "You chose: 🪨\nBot choose: " + rand + "\nThe bot won!";
          }
        }
        let components = message.components;
        for (component in components[0].components) {
          comp = components[0].components[component];
          comp.disabled = true;
          components[0].components[component] = comp;
        }
        interaction.editReply({
          content: " ",
          embeds: [embed],
          components: components,
        });
        await sleep(2000);
        if (embed.fields[0].value != "3/3" && embed.fields[1].value != "3/3") {
          embed.fields[2].value = "Waiting for you...";
          for (component in components[0].components) {
            comp = components[0].components[component];
            comp.disabled = false;
            components[0].components[component] = comp;
          }
          interaction.editReply({
            content: " ",
            embeds: [embed],
            components: components,
          });
        } else {
          embed.fields.pop();
          interaction.editReply({
            content: " ",
            embeds: [embed],
            components: [],
          });
        }
      })();
    }
  },
};
