const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    first_Name:String,
    last_Name:String,
    email:  String,
    password: String,
    confirm:  String ,
    mobile_Number: Number,
    
})

const UserModel = mongoose.model("user", userSchema)
module.exports = {
    UserModel
}