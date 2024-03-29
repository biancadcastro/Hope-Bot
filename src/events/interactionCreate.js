const { selectTicketTopic, createNewTicketTopic, closeTicket, archiveTicket } = require("../modules/functions/tickets");
const { CreateNewWhitelist, CreateWhitelistChannel } = require("../modules/functions/whiteList");

module.exports = {

    name: 'interactionCreate',

    async execute(client, interaction) {
        //selectMenus
        if (interaction.isStringSelectMenu()) {
            const { customId } = interaction

            if ( customId == "select_new_ticket_topic" ) return createNewTicketTopic(client, interaction)
        }

        //botões
        if (interaction.isButton()) {
            const { customId } = interaction

            console.log(customId)

            if ( customId == "open_new_ticket") return selectTicketTopic(client, interaction)

            if ( customId == "close_ticket_button" ) return closeTicket(client, interaction)

            if ( customId == "add_user_to_ticket" ) return

            if ( customId == "archive_ticket" ) return  archiveTicket(client, interaction)

            if ( customId == "open_new_wl" ) return CreateNewWhitelist(client, interaction)
        }
        
        //mensagem
        if (interaction.isChatInputCommand()) {
            const { commandName } = interaction

            const command = client.slashCommands.get(commandName)

            if (command) await command.execute(client, interaction).catch(err => console.log(err))
            
            return setTimeout(() => {
                interaction.deleteReply().catch(() => null)
            }, 1000 * 60 * 10)
        }

        //modal
        if (interaction.isModalSubmit()) {
            const { customId } = interaction

            if ( customId == "new_whitelist_modal" ) return CreateWhitelistChannel(client, interaction)
        }

    },
};