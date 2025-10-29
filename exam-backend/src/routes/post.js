import express from "express";
import controller from "../controllers/postController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { upload } from "../services/upload.js";

export const postRouter = express.Router()

postRouter.use(isAuthenticated)
postRouter.post("/", upload.single("media"), controller.addPost)
postRouter.get("/:id", controller.getPost)
postRouter.delete("/comment/:id", controller.deleteComment)
postRouter.post("/:id/comment", controller.addComment)