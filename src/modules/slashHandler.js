const { Routes } = require('discord.js')
const { REST } = require("@discordjs/rest")
const { readdirSync } = require('fs')
require('dotenv/config')

module.exports = async (client) => {
    const commands = []
    const folders = readdirSync('./src/commands/')

    for (let dir of folders) {
        const commandsData = readdirSync(`./src/commands/`).filter(file => file.endsWith('.js'))

        for await (let file of commandsData) {

            const command = require(`../commands/${file}`)

            if (command && command.data.name) {
                if ( commands.length >= commandsData.length) continue
                
                client.slashCommands.set(command.data.name, command);

                commands.push(command.data);
                
                continue
            }
        }
    }

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN)

    await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands },
    );

    console.log("✔".green, `${commands.length} Slash commands carregados com sucesso!`)
}