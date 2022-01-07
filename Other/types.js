const discord = require("discord.js")
const { Message, Client } = discord



module.exports = {
    message         : Message.prototype,
    client          : Client.prototype,

    args    : [String],
    command : String,

    prefix  : String
}