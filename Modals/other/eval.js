const {
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require("discord.js");
const Discord = require("discord.js");
const tio = require("tryitonline");
const levenshtein = require("fast-levenshtein").get;
let languages;
(async () => {
	let langs = await tio.languages();
	languages = langs.map((lang) => lang.id);
})();

module.exports = {
	dontDefer: true,
	async submit({ interaction }) {
		let TextId = Array.from(interaction.fields.fields.keys())[0];
		let code = interaction.fields.getTextInputValue(TextId);
		let languagename = TextId.split("-")[0];
		let res = await tio.evaluate(
			{
				language: TextId,
				code: code,
			},
			30000
		);
		if (res.status != "passed") {
			let embed = new EmbedBuilder()
				.setColor(0xa31600)
				.addFields([{ name: "**ERROR**", value: "Timed Out!" }])
				.setFooter({ text: "Used NPM: 'tryitonline'" });
			await interaction
				.reply({ content: " ", embeds: [embed], ephemeral: true })
				.then((message) => {
					setTimeout(function () {
						try {
							message.delete();
						} catch {}
					}, 5000);
				});
		}
		if (code.length > 1014 - languagename.length)
			code = code.substr(0, 1011 - languagename.length) + "...";
		if (res.output.length > 1014) res.output = res.output.substr(0, 1011) + "...";
		if (res.warnings.length > 1014)
			res.warnings = res.warnings.substr(0, 1011) + "...";
		if (res.debug.length > 1014) res.debug = res.debug.substr(0, 1011) + "...";
		let embed = new EmbedBuilder().setColor(0x1cd0ce).addFields([
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
		embed.setFooter({ text: "Used NPM: 'tryitonline'" });
		await interaction.reply({ content: " ", embeds: [embed] });
	},
};
