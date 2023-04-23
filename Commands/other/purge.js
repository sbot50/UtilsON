const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
	ActionRowBuilder,
	ButtonBuilder,
	PermissionsBitField,
} = require("discord.js");
const Discord = require("discord.js");
const got = require("got");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("purge")
		.setDescription("Purge messages from a channel!")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("multiple")
				.setDescription("Purges x amount of msgs")
				.addIntegerOption((option) =>
					option
						.setName("amount")
						.setDescription("The amount of messages to purge! (100 max)")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("all").setDescription("Purges all msgs in the channel")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("until")
				.setDescription("Purge until msg ID.")
				.addIntegerOption((option) =>
					option.setName("id").setDescription("The msg ID!").setRequired(true)
				)
		),
		// .addSubcommand((subcommand) =>
		// 	subcommand
		// 		.setName("has")
		// 		.setDescription("Purge msgs with certain content.")
		// 		.addIntegerOption((option) =>
		// 			option
		// 				.setName("content")
		// 				.setDescription("Content to remove.")
		// 				.setRequired(true)
		// 		)
		// ),
	permissions: ["ManageMessages"],
	async execute({ client, args, channel, member, interaction }) {
		if (!member.permissions.has([PermissionsBitField.Flags.Administrator])) {
			let embed = new EmbedBuilder().setColor(0xa31600).addFields([
				{
					name: "**ERROR**",
					value:
						"You aren't permitted to use this command! You need 'Administrator'",
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
		let sub = interaction.options._subcommand;
		let embed = new EmbedBuilder()
			.setColor(0x1cd0ce)
			.setDescription(`Started to purge messages for you!`);
		await interaction.editReply({ content: " ", embeds: [embed] });

		let msgs = await channel.messages.fetch({ limit: 100 });
		msgs = msgs.filter(
			(msg) => msg.interaction == undefined || msg.interaction.id != interaction.id
		);
		console.log(typeof msgs)
		let err,index,done;
		let msgcollection = [];
		while (done != 1) {
			let msgs = await channel.messages.fetch({ limit: 100 });
			msgs = msgs.filter(
				(msg) => msg.interaction == undefined || msg.interaction.id != interaction.id
			);
			if (msgs.size() == 0) {
				done = 1
			}
			for (let msg of msgs) {
				if (sub == "multiple") {
					index += 1;
					msgcollection.append(msg);
					if (index == 100 || index == args.amount || (index == msgs.size() && index != 100)) {
						if (index == args.amount || (index == msgs.size() && index != 100)) {
							done = 1;
						} else {
							args.amount -= 100;
						}
						index = 0;
						if (msgcollection.size() < 2) {
							await channel.bulkDelete(msgcollection);
						} else {
							await msg[1].delete();
						}
						let msgcollection = [];
					}
				} else if (sub == "all") {
					index += 1;
					msgcollection.append(msg);
					if (index == 100 || (index == msgs.size() && index != 100)) {
						index = 0;
						if (msgcollection.size() < 2) {
							await channel.bulkDelete(msgcollection);
						} else {
							await msg[1].delete();
						}
						let msgcollection = [];
					}
				} else if (sub == "until") {
					index += 1;
					msgcollection.append(msg);
					if (index == 100 || msg.id == args.id) {
						if (msg.id == args.id) {
							done = 1;
						}
						index = 0;
						if (msgcollection.size() < 2) {
							await channel.bulkDelete(msgcollection);
						} else {
							await msg[1].delete();
						}
						let msgcollection = [];
					}
				} else if (sub == "has") {
					done = 1;
				}
			}
		}
		embed = new EmbedBuilder()
			.setColor(0x1cd0ce)
			.setDescription(`The purging process is done!`);
		await interaction
			.editReply({ content: " ", embeds: [embed] })
			.then((message) => {
				setTimeout(function () {
					try {
						message.delete();
					} catch {}
				}, 5000);
			});
	},
};
