import express from "express"
import cors from "cors"
import { authRouter } from "./routes/userAuthRoute.js"
import dotenv from "dotenv"

const app = express()
dotenv.config()

app.use(cors()) 
app.use(express.json())
app.use(express.urlencoded())

app.use("/auth", authRouter)

app.listen(4002, () => console.log("http://localhost:4002"))