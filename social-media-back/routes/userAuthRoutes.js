import express from "express";
import controller from "../controllers/userAuthController.js";
import { authMiddleware } from "../middlewares/auth.js"

const router = express.Router()

router.post("/signup", controller.signup)
router.post("/login", controller.login)
router.get("/user", authMiddleware, controller.getUser)

export default router