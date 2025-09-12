import express from "express"
import controller from "../controller/userAuthController.js"
import { authMiddleware } from "../middlewares/auth.js"


export const authRouter = express.Router()

authRouter.post("/signup", controller.signupUser.bind(controller))
authRouter.post("/login", controller.loginUser.bind(controller))
authRouter.get("/user", authMiddleware, controller.sendUserData.bind(controller))
//protected route