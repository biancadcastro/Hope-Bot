const { ActionRowBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { EmbedBuilder, StringSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js")

async function selectTicketTopic(client, interaction) {
    const selectTopicEmbed = new EmbedBuilder()
        .setColor(client.themes.default)
        .setTitle("Selecione o tópico")
        .setDescription("Selecione o assunto ao qual seu ticket se refere, abaixo segue uma lista com todos os tópicos existentes!")
        .addFields(
            {
                name: "・Whitelist",
                value: "↳ Problemas ou duvidas relacionadas a sua whitelist.",
                inline: true
            },
            {
                name: "・Compras",
                value: "↳ Assuntos relacionados a compras de vips e jóias.",
                inline: true
            },
            {
                name: "・Reports",
                value: "↳ Reportar uma quebra de regras, bugs ou recorrer a uma punição.",
                inline: true
            },
            {
                name: "・Outros",
                value: "↳ Outros assuntos.",
                inline: true
            },
        )
        .setThumbnail("https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024")
        .setFooter({ text: "Hope - GTA RP", iconURL: "https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024" })

    const selectTopicRow = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("select_new_ticket_topic")
                .setPlaceholder("Selecione o tópico")
                .addOptions(
                    {
                        label: "・Whitelist",
                        description: "↳ Problemas ou duvidas relacionadas a sua whitelist.",
                        value: "whitelist",
                    },
                    {
                        label: "・Compras",
                        description: "↳ Assuntos relacionados a compras de vips e jóias.",
                        value: "compras",
                    },
                    {
                        label: "・Reports",
                        description: "↳ Reportar uma quebra de regras, bugs ou recorrer a uma punição.",
                        value: "reports",
                    },
                    {
                        label: "・Outros",
                        description: "↳ Outros assuntos.",
                        value: "outros",
                    },
                )
        )

    interaction.reply({ embeds: [selectTopicEmbed], components: [selectTopicRow], ephemeral: true })
}

async function createNewTicketTopic(client, interaction) {
    const categories = {
        "whitelist": "1096655711171252355",
        "compras": "1096655808277778452",
        "reports": "1096655861528678480",
        "outros": "1096655907854757928"
    }

    const allowedCategories = [
        "1096655711171252355",
        "1096655808277778452",
        "1096655861528678480",
        "1096655907854757928"
    ]

    const selectedTopic = interaction.values[0]

    const hopeGuild = await client.guilds.fetch("789331367426261053")

    const existingTicketChannel = await hopeGuild.channels.cache.find(channel => channel.topic == interaction.user.id && allowedCategories.includes(channel.parentId))

    if (existingTicketChannel?.topic == interaction.user.id) {
        return interaction.update({ content: `Parece que você ja possui um ticket aberto, você pode encontra-lo em <#${existingTicketChannel.id}>`, embeds: [], components: [], ephemeral: true })
    }

    await hopeGuild.channels.create({
        name: `${interaction.user.username}`,
        topic: `${interaction.user.id}`,
        type: ChannelType.GuildText,
        parent: categories[selectedTopic],
        reason: "Criando um novo ticket",
        permissionOverwrites: [
            {
                id: interaction.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                deny: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageMessages]
            },
            {
                id: "789331367426261053",
                deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: "811033392820387890",
                allow: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: "811033439033098281",
                allow: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: "811033484402753556",
                allow: [PermissionsBitField.Flags.ViewChannel]
            }
        ]
    })

    const newTicketChannel = await hopeGuild.channels.cache.find(channel => channel.topic == interaction.user.id && allowedCategories.includes(channel.parentId))

    const ticketManageEmbed = new EmbedBuilder()
        .setColor(client.themes.default)
        .setTitle("Painel de moderação")
        .setDescription("Abaixo você encontra as ações possiveis para gerenciar este ticket, abaixo segue uma lista detalhando cada função!")
        .addFields(
            {
                name: "・Fechar ticket",
                value: "↳ Fecha o ticket e indica o problema/ajuda como resolvida.",
                inline: true
            },
            {
                name: "・Arquivar ticket",
                value: "↳ Arquiva o ticket para uma analise futura.",
                inline: true
            },
            {
                name: "・Adicionar usuario",
                value: "↳ Libera acesso a um novo usuario no ticket.",
                inline: true
            },

        )
        .setThumbnail("https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024")
        .setFooter({ text: "Hope - GTA RP", iconURL: "https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024" })

    const ticketManageRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("close_ticket_button")
                .setLabel("Fechar ticket")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("add_user_to_ticket")
                .setLabel("Adicionar usuario ao ticket")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("archive_ticket")
                .setLabel("Arquivar ticket")
                .setStyle(ButtonStyle.Secondary),
        )

    newTicketChannel.send({ embeds: [ticketManageEmbed], components: [ticketManageRow] })

    interaction.update({ content: `Seu ticket foi aberto em <#${newTicketChannel.id}>!`, embeds: [], components: [], ephemeral: true })
}

async function closeTicket(client, interaction) {
    const allowedParents = [
        "1096655711171252355",
        "1096655808277778452",
        "1096655861528678480",
        "1096655907854757928"
    ]

    if (!allowedParents.includes(interaction.channel.parentId)) return interaction.deferUpdate()

    const adminRoles = [
        "1066120532090687508",
        "811033759515934721",
        "811033392820387890",
        "811033439033098281",
        "811033484402753556"
    ]

    const role = interaction.member.roles.cache.find(role => adminRoles.includes(role.id))

    if (!role) return interaction.deferUpdate()

    const closedTicketEmbed = new EmbedBuilder()
        .setColor(client.themes.default)
        .setTitle("Ticket fechado")
        .setDescription("Este ticket foi fechado com sucesso")
        .setThumbnail("https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024")
        .setFooter({ text: "Hope - GTA RP", iconURL: "https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024" })

    const ClosedTicketRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("delete_ticket_channel")
                .setLabel("Deletar canal")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)
        )

    interaction.channel.send({embeds: [closedTicketEmbed], components: [ClosedTicketRow]})

    await interaction.channel.setParent("1097137803357331466")

    await interaction.channel.permissionOverwrites.set([
        {
            id: "789331367426261053",
            deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: "811033392820387890",
            allow: [PermissionsBitField.Flags.ViewChannel],
            deny: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages]
        },
        {
            id: "811033439033098281",
            allow: [PermissionsBitField.Flags.ViewChannel],
            deny: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages]

        },
        {
            id: "811033484402753556",
            allow: [PermissionsBitField.Flags.ViewChannel],
            deny: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages]

        }
    ])

    interaction.deferUpdate()
}

async function archiveTicket(client, interaction) {
    const allowedParents = [
        "1096655711171252355",
        "1096655808277778452",
        "1096655861528678480",
        "1096655907854757928"
    ]

    if (!allowedParents.includes(interaction.channel.parentId)) return interaction.deferUpdate()

    const adminRoles = [
        "1066120532090687508",
        "811033759515934721",
        "811033392820387890",
        "811033439033098281",
        "811033484402753556"
    ]

    const role = interaction.member.roles.cache.find(role => adminRoles.includes(role.id))

    if (!role) return interaction.deferUpdate()

    const archivedTicketEmbed = new EmbedBuilder()
        .setColor(client.themes.default)
        .setTitle("Ticket arquivado")
        .setDescription("Este ticket foi arquivado com sucesso")
        .setThumbnail("https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024")
        .setFooter({ text: "Hope - GTA RP", iconURL: "https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024" })

    const archivedTicketRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("delete_ticket_channel")
                .setLabel("Deletar canal")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)
        )

    interaction.channel.send({embeds: [archivedTicketEmbed], components: [archivedTicketRow]})

    await interaction.channel.setParent("1097137840539844608")

    await interaction.send.permissionOverwrites.set([
        {
            id: "789331367426261053",
            deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: "811033392820387890",
            allow: [PermissionsBitField.Flags.ViewChannel],
            deny: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages]
        },
        {
            id: "811033439033098281",
            allow: [PermissionsBitField.Flags.ViewChannel],
            deny: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages]

        },
        {
            id: "811033484402753556",
            allow: [PermissionsBitField.Flags.ViewChannel],
            deny: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages]

        }
    ])

    interaction.deferUpdate()
}

module.exports = {
    selectTicketTopic,
    createNewTicketTopic,
    closeTicket,
    archiveTicket
}