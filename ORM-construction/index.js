import express from "express"
import userModel from "./models/users.js"

const app = express()

app.get("/users", async (req, res) => {
  const users = await userModel.query().select("name", "salary","age").where("age", ">", 20).andWhere("salary", 2000).limit(2).get()
  res.send({users})
})

app.listen(4002, () => console.log("http://localhost:4002"))