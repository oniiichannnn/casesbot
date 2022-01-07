const Discord   = require("discord.js")
const mongoose  = require("mongoose")

const ms    = require("ms")
const pms   = require("pretty-ms")

const {
    Client, MessageEmbed
} = Discord

const Types = require('../Other/types.js')
const Tools = require('../Other/tools.js')
const { UserModel } = require("../Other/models.js")

const { getUser, updateCases } = Tools

module.exports = {
    names       : [ "addjailtime", "ajt" ],
    description : "",

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

        let Time
        try {
            const TimeContent = args
                .filter((arg, index) => index !== 0)
                .join(" ")

            Time = ms(TimeContent)
        } catch {
            return message.channel.send({
                content: `${message.author} You need to give me the amount of jail time to add to **${User.tag}**`
            })
        }

        const GetDb = await UserModel.findOne({ _id: User.id })
        if (GetDb === null) {
            await Tools.createUserStats({
                _id: User.id,
                jailTime: Time
            })
        } else {
            await GetDb.updateOne({
                jailTime: Time
            })
        }

        await message.channel.send({
            content: `Alright, I have added **${pms(Time, { verbose: true })}** jail time to **${User.tag}**`
        })
    }
}