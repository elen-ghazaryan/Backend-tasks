import express from "express"
import controller from "../controller/userAuthController.js"


export const authRouter = express.Router()

authRouter.post("/signup", controller.signupUser.bind(controller))
authRouter.post("/login", controller.loginUser.bind(controller))
