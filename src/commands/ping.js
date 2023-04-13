const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	help: {
        commandName: "ping",
        category: "utilidades",
        description: "Este comando serve para você ver informações sobre o ping da Hope!",
        shortDescription: "Mostra o ping das aplicações da Hope",
        embedFields: [
            {
                name: "<:JakeShards:964563863762776155> Modos disponiveis:",
                value: "↳ **/ping**"
            },
            {
                name: "/ping",
                value: "↳ Mostra o ping das aplicações."
            }
        ]
    },
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('🌻 Utilidades ▹ Informa o ping da Hope')
		.setDMPermission(false),

	async execute(client, interaction) {
		function emojiFormat(ms) {
			if (!ms) return "🔴 Offline"
			if (ms > 800) return `🟤 ${ms}ms`

			return ms < 250
				? `🟢 ${ms}ms`
				: `🟠 ${ms}ms`
		}

		let toSubtract = Date.now()
		
		const mainPingEmbed = new EmbedBuilder()
			.setColor(client.themes.default)
			.setTitle("Pong! <:JakePong:871225286388240394>")
			.setDescription("Aqui está o ping da Hope!")
			.addFields(
				{
					name: "<:JakeCluster:1063003528848752721> Cluster",
					value: "↳ Alfa",
					inline: true
				},
				{
					name: "<:JakeRaio:1063003526533488702> Bot ping",
					value: `↳ ${emojiFormat(client.ws.ping)}`,
					inline: true
				},
			)
			.setThumbnail("https://jake-website-ybabyzinha.vercel.app/images/bot/raio.png")
			.setFooter({ text: `${interaction.user.username} ás ${client.timezone.format("hh:mm a")}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })

		const mainReply = await interaction.reply({ embeds: [mainPingEmbed], fetchReply: true })

		return setTimeout(() => {
			interaction.deleteReply().catch(() => null)
		}, 1000 * 60 * 2)
	},
};