import express from "express"
import { readAll, save } from "./lib/db.js"

const app = express()

app.use(express.json())  
app.use(express.urlencoded()) 

app.set("view engine", "pug")  
app.set("views", "pages")      

app.get("/", async (req, res) => {
    const users = await readAll()
    res.render("home", {users})
})

app.get("/add", (req, res) => {
    res.render("add")
})

app.post("/add", async (req, res) => {
    await save(req.body)
    res.redirect("/")
})

app.get("/users", async (req, res) => {
    const users = await readAll()
    res.render("list", {users})
})

app.listen(4002, () => console.log("http://localhost:4002"))