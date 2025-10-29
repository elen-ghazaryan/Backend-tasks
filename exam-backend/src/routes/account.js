import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import accountController from '../controllers/accountController.js'
export const accountRouter = express.Router()


accountRouter.use(isAuthenticated)
accountRouter.get('/search/:text', accountController.searchUsers)
accountRouter.get("/:id", accountController.getUser )