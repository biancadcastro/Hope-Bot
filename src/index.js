const Bot = require("./classes/client")
const { GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const colors = require("colors");
require("dotenv").config()

require("dotenv").config()

const client = new Bot({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers] })

module.exports = client

const eventFiles = fs
    .readdirSync("./src/events")
    .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    try {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
    } catch (e) {
        console.log(
            `O evento`.red, `"${file}"`.white, `possuiu um erro durante seu carregamento!`.red
        );
    }
}

//login
client.login(process.env.DISCORD_BOT_TOKEN);