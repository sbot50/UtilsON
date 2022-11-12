const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  async click({ guild, member, interaction }) {
    let message = interaction.message;
    let choice = await message.components[0].components.filter(c => c.customId == interaction.customId)[0].label.replace(/ +/g,"");
    let embed = message.embeds[0];
    let chosen = JSON.parse(decodeURIComponent(embed.url).replace("https://google.com/?json=",""));
    let id = member.user.id;
    let included;
    for (key of Object.keys(chosen)) {
        if (chosen[key].includes(id)) {
            included = key;
            break;
        }
    }
    if (included == choice) {
        interaction.editReply({});
        return;
    }
    if (included != undefined) {
      chosen[included].splice(chosen[included].indexOf(id), 1);
    }
    chosen[choice].push(id);
    let poll = JSON.parse(decodeURIComponent(embed.image.url.replace("https://quickchart.io/chart?bkg=white&c=","")));
    let datasets = poll.data.datasets;
    for (dataset in datasets) {
        let label = datasets[dataset].label.replace(/ +/g,"");
        datasets[dataset].data = [ chosen[label].length ];
    }
    poll.data.datasets = datasets;
    poll = encodeURIComponent(JSON.stringify(poll));
    let imageUrl = "https://quickchart.io/chart?bkg=white&c=" + poll;
    chosen = encodeURIComponent(JSON.stringify(chosen).replace(/\s/g,""));
    let url = `https://google.com/?json=${chosen}`;
    embed = EmbedBuilder.from(embed);
    embed.setImage(imageUrl);
    embed.setURL(url);
    interaction.editReply({ embeds: [embed] });
  },
};
