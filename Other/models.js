const mongoose = require("mongoose")

module.exports = {
    UserModel: mongoose.model("user stats",
        new mongoose.Schema({
            _id     : String,

            courtCasesWon    : Number,
            courtCasesLost   : Number,

            moneyDropped    : Number,

            jailTime        : Number
        })
    )
}