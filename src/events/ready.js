const { ActivityType, EmbedBuilder } = require("discord.js");
const slashCommandsHandler = require("../modules/slashHandler")
const moment = require("moment-timezone");

module.exports = {
    name: "ready",

    async execute(client) {
        
        console.clear()
        console.log("✔".green, `Logado com o bot ${client.user.username} 🚀`)

        slashCommandsHandler(client)

        let activities = [
            "Bot desenvolvido pela Moon ⁵⁴ 🌜",
            `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} membros! 👤`,
            `Agora na versão 1.0.1! 🚀`
        ];

        let i = 0;

        setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: ActivityType.Streaming, }), 1000 * 15);

        client.user.setStatus("online");
    }
}