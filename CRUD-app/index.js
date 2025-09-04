import express from "express";
import { deleteUser, editUser, findUser, readAll, save } from "./lib/db.js";

const app = express()
app.use(express.json())
app.use(express.urlencoded())

app.set("view engine", "pug");
app.set("views", "pages");


app.get("/", async (req, res) => {
    const users = await readAll()
    res.render("home", {users})
})

app.get("/add", (req, res) => {
    res.render("add")
})

app.post("/add", async (req, res) => {
  try {
    await save({...req.body, id:Date.now()});
    res.redirect("/"); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/user/delete/:id", async (req, res) => {
    await deleteUser(req.params.id)
    res.redirect("/")
})

app.get("/user/edit/:id", async (req, res) => {
    const user = await findUser(req.params.id)
    res.render("edit", {user})
})

app.post("/user/edit/:id", async (req, res) => {
    const user = await editUser(req.body, req.params.id)
    res.redirect("/")
})

app.listen(4000, () => console.log("http://localhost:4000"))
