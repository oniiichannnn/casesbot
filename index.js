const Discord   = require("discord.js")
const mongoose  = require("mongoose")

const ms    = require("ms")
const pms   = require("pretty-ms")

const fs = require("fs")

const {
    Client, MessageEmbed
} = Discord

const client = new Client({
    intents: [ "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES" ]
})

const TOKEN         = "" // Bot token
const mongooseURL   = "" // URL to the database

let isReady = false

client.commands = new Map()

client.on("ready", () => {
    console.log("Loading command files")

    const Files = fs.readdirSync("./Commands")

    for (const file of Files) {
        const { names } = require(`./Commands/${file}`)

        for (const name of names) {
            client.commands.set(name, `./Commands/${file}`)
        }
    }

    isReady = true
    console.log("Bot online")
})


const Prefix = "!"
client.on("messageCreate", async message => {
    if (!message.content.toLowerCase().startsWith(Prefix) || message.author.bot || message.webhookId) return

    if (!isReady) return message.channel.send({
        content: `Please wait for a few seconds, I am still getting ready`
    })

    const args      = message.content.split(/ +/g)
    const command   = args[0].toLowerCase().slice(Prefix.length).trim()

    args.shift()

    const getCommand = client.commands.get(command)
    if (!getCommand) return

    try {
        const CommandFile = require(getCommand)

        await CommandFile.execute({
            message,
            client,
            args,
            command,
            Prefix
        })
    } catch (e) {
        console.log(e)

        await message.channel.send({
            content: `Oops! An error occured`
        })
    }
})

HandleConnections().then()

async function HandleConnections () {
    await ConnectToDatabase()
    await Login()

    async function Login() {
        try {
            await client.login(TOKEN)
        } catch (e) {
            console.log("There was an issue with logging in, retrying", e)

            await Login()
        }
    }

    async function ConnectToDatabase () {
        try {
            await mongoose.connect(mongooseURL)
        } catch (e) {
            console.log("There was an issue while connecting to the database", e)

            await ConnectToDatabase()
        }
    }
}