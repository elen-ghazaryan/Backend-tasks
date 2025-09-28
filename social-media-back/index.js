import express from "express"
import userAuthRoutes from "./routes/userAuthRoutes.js" 
import sequelize from "./db/config.js"
import cors from "cors"
import swaggerUI from "swagger-ui-express"
import YAML from "yamljs"

const app = express()
const docs = YAML.load("./docs/api.yaml")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

sequelize.sync().then(() => {
  console.log("Database has been connected successfully")
})

app.use("/api", swaggerUI.serve, swaggerUI.setup(docs))
app.use("/auth", userAuthRoutes)

app.listen(4000, () => console.log("http://localhost:4000/api"))