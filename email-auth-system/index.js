const express = require("express")
const app = express()
const authRouter= require("./routes/auth")
const db = require("./models")

db.sequelize.sync({alter: true}).then(() => {
  console.log("DB SYNCED!")
})

app.use(express.json())
app.use(express.urlencoded())
app.use("/auth", authRouter)

app.listen(4002,() => console.log("http://localhost:4002"))