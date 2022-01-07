const Discord   = require("discord.js")
const mongoose  = require("mongoose")

const ms    = require("ms")
const pms   = require("pretty-ms")

const {
    Client, MessageEmbed
} = Discord

const Types = require('../Other/types.js')
const Tools = require('../Other/tools.js')

const { getUser, updateCases } = Tools

module.exports = {
    names       : [ "addcase" ],
    description : "Adds a case to a user",

    /**
     *
     * @param {Types} param0
     */
    async execute({
        message, client, args, command
    }) {
        const User = await getUser(message)

        if (!User) return message.channel.send({
            content: `${message.author} You need to mention a user or provide their user id!`
        })

        const CasesCount = Number(args[1])
        if (!CasesCount) return message.channel.send({
            content: `${message.author} You need to give me a amount of cases to add to **${User.tag}**`
        })

        let Status = args[2] || ""

        if (!["win", "lost"].some(op => op === Status.toLowerCase())) {
            const sentMessage = await message.channel.send({
                content: `${message.author} Select the case type`,
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                        .setLabel("Win")
                        .setStyle("SUCCESS")
                        .setCustomId(`win`),

                        new Discord.MessageButton()
                        .setLabel("Lost")
                        .setStyle("DANGER")
                        .setCustomId(`lost`)
                    )
                ]
            })

            try {
                const int = await sentMessage.awaitMessageComponent({
                    filter  : i => i.user.id === message.author.id,
                    time    : ms("5 minutes")
                })

                await int.deferUpdate()

                const Status = int.customId.toUpperCase()

                await updateCases(User.id, CasesCount, 'ADD', Status)

                await int.editReply({
                    content: `Alright, I have added **${CasesCount}** ${Status.toLowerCase()} cases to **${User.tag}**`,

                    components: []
                })
            } catch (e) {
                console.log(e)

                await sentMessage.edit({
                    content: `${message.author} You did not respond in time`,
                    components: []
                })

                return
            }
        } else {
            await updateCases(User.id, CasesCount, 'ADD', Status.toUpperCase())

            await message.channel.send({
                content: `Alright, I have added **${CasesCount}** ${Status.toLowerCase()} cases to **${User.tag}**`
            })
        }
    }
}