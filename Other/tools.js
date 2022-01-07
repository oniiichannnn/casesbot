const Discord = require("discord.js")
const {
    UserModel:UserStatsModel
} = require("./models.js")

/**
 *
 * @param {Discord.Message} message
 * @returns {Discord.User}
 */
exports.getUser = async (message) => {
    const args = message.content.split(/ +/g)
    args.shift()

    let user = message.mentions.users.first()

    if (Number(args[0])) {
        try {
            user = (await message.guild.members.fetch(args[0]))?.user
        } catch { }
    }

    return user
}

/**
 *
 * @param {string} id
 * @param {number} count
 * @param {"ADD"|"REMOVE"} type
 * @param {"WIN"|"LOST"} status
 */
exports.updateCases = async (id, count, type, status) => {
    const GetCases = await UserStatsModel.findOne({ _id: id })

    switch (type) {
        case 'ADD': {
            if (GetCases === null) {

                await this.createUserStats({
                    _id: id,

                    courtCasesWon   : status === "WIN"  ? count : 0,
                    courtCasesLost  : status === "LOST" ? count : 0
                })

            } else {
                await GetCases.updateOne({
                    courtCasesWon   :
                        status === "WIN"  ? GetCases.courtCasesWon + count  : GetCases.courtCasesWon,

                    courtCasesLost  :
                        status === "LOST" ? GetCases.courtCasesLost + count : GetCases.courtCasesLost
                })
            }
        } break;

        case 'REMOVE': {
            if (GetCases === null) {
                return "no cases"
            } else {
                if (
                    status === "WIN" ?
                        GetCases.courtCasesWon < count
                        :
                        GetCases.courtCasesLost < count
                ) return "inferior"

                await GetCases.updateOne({
                    courtCasesWon   :
                        status === "WIN"  ? GetCases.courtCasesWon - count  : GetCases.courtCasesWon,

                    courtCasesLost  :
                        status === "LOST" ? GetCases.courtCasesLost - count : GetCases.courtCasesLost
                })
            }
        } break;
    }
}

exports.createUserStats = async (data) => {

    const newData = new UserStatsModel({
        _id     : data.id || data._id,

        courtCasesWon    : data.courtCasesWon  || 0,
        courtCasesLost   : data.courtCasesLost || 0,

        moneyDropped    : data.moneyDropped || 0,

        jailTime        : data.jailTime || 0
    })

    return await newData.save()
}

exports.convertNumToPercentage =  (num, maxValue) =>  {
    return Math.round( (num / maxValue) * 100 )
}

exports.getPercentagOfNum =  (percentage, maxValue) =>  {
    return Math.round( (percentage / 100) * maxValue )
}