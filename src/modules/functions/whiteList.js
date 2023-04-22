const { TextInputBuilder, ActionRowBuilder, ModalBuilder, ButtonBuilder } = require("@discordjs/builders")
const { ChannelType, PermissionsBitField, TextInputStyle, ButtonStyle, EmbedBuilder } = require("discord.js")
const moment = require("moment-timezone")
const mysql = require("../../utils/mySql")

async function CreateNewWhitelist(client, interaction) {
    if (!interaction.member.roles.cache.find(role => role.id == "811033953288585237")) return interaction.deferUpdate()

    const existingWhitelistChannel = await interaction.guild.channels.cache.find(channel => channel.topic == `WhiteList - ${interaction.user.id}` && channel.parent == "1098417356155408445")

    if (existingWhitelistChannel?.topic == `WhiteList - ${interaction.user.id}`) {
        return interaction.reply({ content: `Parece que você ja possui uma whitelist aberta, você pode encontra-la em <#${existingWhitelistChannel.id}>`, embeds: [], components: [], ephemeral: true })
    }

    const row1 = new ActionRowBuilder()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("id_input")
                .setStyle(TextInputStyle.Short)
                .setLabel("ID do fiveM")
                .setRequired(true)
        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("name_input")
                .setStyle(TextInputStyle.Short)
                .setLabel("Seu nome")
                .setRequired(true)
        )

    const row3 = new ActionRowBuilder()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("age_input")
                .setStyle(TextInputStyle.Short)
                .setLabel("Sua idade")
                .setRequired(true)
        )

    const row4 = new ActionRowBuilder()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("person_name_input")
                .setStyle(TextInputStyle.Short)
                .setLabel("Nome do personagem")
                .setRequired(true)
        )

    const row5 = new ActionRowBuilder()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("person_age_input")
                .setStyle(TextInputStyle.Short)
                .setLabel("Idade do personagem")
                .setRequired(true)
        )

    const modal = new ModalBuilder()
        .setCustomId("new_whitelist_modal")
        .setTitle("Bem vindo a Hope")
        .addComponents(row1, row2, row3, row4, row5)

    interaction.showModal(modal)
}

async function CreateWhitelistChannel(client, interaction) {
    const fivemId = interaction.fields.getTextInputValue('id_input');
    const userName = interaction.fields.getTextInputValue('name_input');
    const userAge = interaction.fields.getTextInputValue('age_input');
    const personName = interaction.fields.getTextInputValue('person_name_input');
    const personAge = interaction.fields.getTextInputValue('person_age_input');

    if (isNaN(fivemId) || isNaN(userAge) || isNaN(personAge)) {
        return interaction.reply({ content: "Você deve fornecer um valor numérico nos campos de ID, sua idade e idade do personagem!", ephemeral: true })
    }

    const lowerAgeEmbed = new EmbedBuilder()
        .setColor(client.themes.default)
        .setTitle("Você não possui idade o suficiente!")
        .setDescription("Para jogar na Hope, você precisa ter no minimo 16 anos... Que tal tentar novamente daqui a alguns anos?")
        .setThumbnail("https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024")
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024", text: "Hope - GTA RP" })

    if (16 > userAge) return interaction.reply({embeds: [lowerAgeEmbed], ephemeral: true})

    if (fivemId && fivemId > 0) {
        const table = "accounts"
        const column = "whitelist"
        const identifier = "id"

        interaction.member.roles.add("811034029674856448")
        interaction.member.roles.remove("811033953288585237")

        await mysql.query(`UPDATE ${table} SET ${column} = '1', discord = ${interaction.user.id} WHERE ${identifier} = ?`, [fivemId]).catch(err => console.log(err))
    } else {
        console.log("não foi")
        interaction.reply({ content: "Não foi possivel liberar sua whitelist", ephemeral: true })
    }

    moment.tz("America/Sao_Paulo")
    moment.locale("pt-br")

    const logEmbed = new EmbedBuilder()
        .setColor(client.themes.default)
        .setTitle("Nova whitelist aprovada")
        .setDescription(`Whitelist aprovada às ${moment().format('h:mm:ss a')} \n\n \`\`\`・Usuario: ${interaction.user.username} \n・Idade do usuario: ${userAge} \n・ID do fiveM: ${fivemId} \n・Nome do personagem: ${personName} \n・Idade do personagem: ${personAge} \`\`\``)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024", text: "Hope - GTA RP" });

    const logChannel = interaction.guild.channels.cache.find(channel => channel.id == "814383630100463636")

    await logChannel.send({ embeds: [logEmbed] })

    const approveEmbed = new EmbedBuilder()
        .setColor(client.themes.default)
        .setTitle("Sua whitelist foi aprovada!")
        .setDescription("Parabens, você ja pode entrar na cidade e criar seu personagem! \n\n Após entrar na cidade e criar seu personagem, atualize seu ID aqui no servidor do discord com o comando \`/atualizarId\`!")
        .setThumbnail("https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024")
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1096650303526420551/1096650355997163520/Logo_Hope_2.0_-_Fundo_Preto.png?width=1024&height=1024", text: "Hope - GTA RP" })

    interaction.member.setNickname(personName)

    return interaction.reply({embeds: [approveEmbed], ephemeral: true})
}

module.exports = {
    CreateNewWhitelist,
    CreateWhitelistChannel
}