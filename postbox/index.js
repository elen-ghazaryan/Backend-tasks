import express from "express";
import { readAll, save } from "./lib/db.js";
import postRoutes from "./routes/postRoutes.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use("/post", postRoutes)


app.set("view engine", "ejs")
app.set("views", "views")


app.get("/", async (req, res) => {
    const posts = await readAll()
    res.render("home", { posts })
})

app.get("/add", (req, res) => {
    res.render("add")
})

app.post("/add", async (req, res) => {
    const id = crypto.randomUUID()
    await save({ ...req.body, id, comments:[]})
    res.redirect("/")
})

app.listen(4002, () => console.log("http://localhost:4002"))