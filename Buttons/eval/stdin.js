const Discord = require("discord.js");
let languages;
(async () => {
	let langs = await tio.languages();
	languages = langs.reduce((acc, item) => {
		acc[item.name] = item.id;
		return acc;
	  }, {});
})();

function toomuchtext(text, max) {
	if (text.length > max) {
		text = text.substr(0, max - 3);
		if (!text.endsWith("\n") && text.lastIndexOf("\n") != -1)
			text = text.substring(0, text.lastIndexOf("\n") + 1);
		text = text + "...";
	}
	return text;
}

module.exports = {
	async click({ member, interaction }) {
		let message = interaction.message;
		let embed = message.embeds[0];
		let TextId = embed.title;
		let code = embeds.fields[0].value;
		let languagename = TextId.split("-")[0];
        await interaction.editReply({ content: " ", embeds: [embed] });
		let res = await tio.evaluate(
			{
				language: TextId,
				code: code,
			},
			30000
		);
		if (res.status != "passed") {
			embed = new EmbedBuilder()
				.setColor(0xa31600)
				.addFields([{ name: "**ERROR**", value: "Timed Out!" }])
				.setFooter({ text: "Used NPM: 'tryitonline'" });
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
		code = toomuchtext(code, 1014 - languagename.length);
		res.output = toomuchtext(res.output, 1014);
		res.warnings = toomuchtext(res.warnings, 1014);
		res.debug = toomuchtext(res.debug, 1014);
		embed = new EmbedBuilder()
			.setColor(0x1cd0ce)
			.setTitle(languages[TextId])
			.addFields([
				{
					name: "**Input**",
					value: "```" + languagename + "\n" + code.replace(/`/g, "´") + "\n```",
				},
			]);
		if (res.output.length > 0) {
			embed.addFields([
				{
					name: "**Eval**",
					value: "```\n" + res.output.replace(/`/g, "´") + "\n```",
				},
			]);
		}
		if (res.warnings.length > 0) {
			embed.addFields([
				{
					name: "**Warnings**",
					value: "```\n" + res.warnings.replace(/`/g, "´") + "\n```",
				},
			]);
		}
		if (res.debug.length > 0) {
			embed.addFields([
				{
					name: "**Debug**",
					value: "```\n" + res.debug.replace(/`/g, "´") + "\n```",
				},
			]);
		}
		button = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("stdin")
				.setLabel("Run with Input")
				.setStyle(ButtonStyle.Primary)
		);
		embed.setFooter({ text: "Used NPM: 'tryitonline'" });
		await interaction.editReply({
			content: " ",
			embeds: [embed],
			components: [button],
		});
	},
};
