const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const cors = require("cors")
require("dotenv").config()

const {connection} = require("./config/db")
const {UserModel} = require("./models/User.model")
const app = express();

app.use(express.json())
app.use(cors({
    origin : "*"
}))

app.get("/", (req, res) => {
    res.send("Welcome")
})

app.post("/signup", async (req, res) => {
    console.log(req.body)
    const {first_Name, last_Name, mobile_number,email, password,confirm} = req.body;
    const userPresent = await UserModel.findOne({email})
    //TODO
    if(userPresent?.email){
        res.send({"msg": "User already exist"})
    }
    else{
        try{
            bcrypt.hash(password, 4, async function(err, hash) {
                const user = new UserModel({first_Name,last_Name,mobile_number,email,password:hash,confirm:hash})
                console.log(user);
                await user.save()
                res.send({"msg":"Sign up successfull"})
            });
           
        }
       catch(err){
            console.log(err)
            res.send({"err":"Something went wrong, pls try again later"})
       }
    }
    
})

app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await UserModel.find({email})
         
      if(user.length > 0){
        const hashed_password = user[0].password;
        bcrypt.compare(password, hashed_password, function(err, result) {
            if(result){
                const token = jwt.sign({"userID":user[0]._id}, 'hush');
                res.send({"msg":"Login successfull","token" : token})
            }
            else{
                res.send({"err":"Invalid Password"})
            }
      })} 
      else{
        res.send({"err": "Invalid email Id"})
      }
    }
 
    catch{
        res.send("Something went wrong, please try again later")
    }
})


app.get("/about", (req, res) => {
    res.send("About us data..")
})
app.listen(process.env.port, async () => {
    try{
        await connection;
        console.log("Connected to DB Successfully")
    }
    catch(err){
        console.log("Error connecting to DB")
        console.log(err)
    }
    console.log(`Listening on PORT ${process.env.port}`)
})

