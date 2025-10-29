import express from 'express'
import { env } from './src/config/env.js'
import { connectDb, disconnectDb } from './src/config/db.js'
import { userRouter } from './src/routes/user.js'
import { accountRouter } from './src/routes/account.js'
import { postRouter } from './src/routes/post.js'
const app = express()

app.use(express.urlencoded())
app.use(express.json())
app.use(express.static("public/uploads"))

app.use("/auth", userRouter)
app.use("/account", accountRouter)
app.use("/post", postRouter)


async function start() {
    await connectDb()
    app.listen(env.PORT, async () => {
        console.log(`Server started on: http://localhost:${env.PORT}`)
        console.log("Mongo Connected!")
    })
}

start()

process.on('SIGINT', () => disconnectDb())
process.on('SIGTERM', () => disconnectDb())
