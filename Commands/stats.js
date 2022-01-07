const Discord   = require("discord.js")
const mongoose  = require("mongoose")

const ms    = require("ms")
const pms   = require("pretty-ms")

const {
    Client, MessageEmbed
} = Discord

const Types = require('../Other/types.js')
const Tools = require('../Other/tools.js')

const { getUser, updateCases, getPercentagOfNum, convertNumToPercentage } = Tools
const { UserModel:UserStatsModel } = require("../Other/models.js")

module.exports = {
    names       : [ "stats" ],
    description : "Adds a case to a user",

    /**
     *
     * @param {Types} param0
     */
    async execute({
        message, client, args, command
    }) {
        const User = await getUser(message) || message.author

        const GetCases = await UserStatsModel.findOne({ _id: User.id })

        if (GetCases === null) return message.channel.send(DisplayMessage(null))

        await message.channel.send(DisplayMessage(GetCases))

        function DisplayMessage (Data) {
            const Total = (Data?.courtCasesWon || 0) + (Data?.courtCasesLost || 0)

            return {
                embeds: [
                    new MessageEmbed()
                    .setAuthor({ name: User.tag, iconURL: User.displayAvatarURL({ dynamic: true }) })
                    .setDescription(
                        `**Cases Total:** ${Total}\n`+

                        `**Won Cases:** ${Data?.courtCasesWon || 0} (${
                            Data?.courtCasesWon ?
                                convertNumToPercentage(Data?.courtCasesWon, Total)
                                :
                                0
                        }%)\n`+

                        `**Lost Cases:** ${Data?.courtCasesLost || 0} (${
                            Data?.courtCasesLost ?
                                convertNumToPercentage(Data?.courtCasesLost, Total)
                                :
                                0
                        }%)\n`+

                        `**Money Dropped:** ${Data?.moneyDropped || 0}\n`+
                        `**Jail Time:** ${Data?.jailTime ? pms(Data.jailTime) : "none"}`
                    )
                    .setColor("BLURPLE")
                ]
            }
        }
    }
}