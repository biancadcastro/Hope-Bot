module.exports = {

    name: 'interactionCreate',

    async execute(client, interaction) {
        //mensagem
        if (interaction.isChatInputCommand()) {
            const { commandName } = interaction

            const command = client.slashCommands.get(commandName)

            if (command) await command.execute(client, interaction).catch(err => unhadleRejection(err, client))
            
            return setTimeout(() => {
                interaction.deleteReply().catch(() => null)
            }, 1000 * 60 * 10)
        }

    },
};