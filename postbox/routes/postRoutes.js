import express from "express"
import postController from "../controllers/postController.js"

const router = express.Router()

router.get("/:id", postController.findPost.bind(postController))
router.post("/:id/add/comment", postController.addComment.bind(postController))
router.post("/:id/delete", postController.deletePost.bind(postController))

export default router
