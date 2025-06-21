const mongoose = require("mongoose");
async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to mongoDb")
    } catch (error) {
        console.log(" Can not connect to mongoDb")
    }
}
module.exports = connectToDb;