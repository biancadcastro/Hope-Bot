const { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType, ChannelSelectMenuBuilder, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('atualizarid')
        .setDescription('Atualiza seu ID no discord')
        .addNumberOption(option => 
            option
                .setName("id")
                .setDescription("Id do seu personagem")
                .setRequired(true)
        )
        .setDMPermission(false),

    async execute(client, interaction) {
        const ID = interaction.options.getNumber('id')

        const notApprovedEmbed = new EmbedBuilder()
            .setColor(client.themes.default)
            .setTitle("Sua whitelist não foi aprovada ainda")
            .setDescription("Para atualizar seu ID aqui no discord você precisa ter criado sua whitelist e seu personagem no servidor!")
            .setThumbnail("https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024")
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024", text: "Hope - GTA RP" })

        if (!interaction.member.roles.cache.has("811034029674856448")) return interaction.reply({embeds: [notApprovedEmbed], ephemeral: true})

        interaction.member.setNickname(`${ID} | ${interaction.member.nickname}`)

        return interaction.reply({content: "Seu ID foi atualizado com sucesso, tenha uma boa gameplay! Atenciosamente, equipe Hope Royale RP.", ephemeral: true})
    },
};