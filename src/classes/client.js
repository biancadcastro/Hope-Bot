const { Client, Collection } = require('discord.js')
const moment = require('moment-timezone')

const client = class JakeBot extends Client {
    constructor(data) {
        super(data)

        this.themes = {
            default: "#b103fc",
            warn: "#ff0000",
            success: "#44ff00"
        }

        this.events = new Collection();

        this.slashCommands = new Collection();

        this.contextMenus = new Collection();

        this.slashCommandsHelpData = []

        this.timezone = moment.tz("America/Sao_Paulo")
    }
}

module.exports = client