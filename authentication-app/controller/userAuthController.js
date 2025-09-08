import { getUserByLogin } from "../lib/db.js"
import userAuthModel from "../model/userAuthModel.js"
import bcrypt from "bcrypt"

class userAuthController {
    model = new userAuthModel()
    async signupUser (req, res) {
        const user = req.body

        const found = await getUserByLogin(user.login)
            if(found) {
                return res.status(400).send({message: "Login is busy!"})
            }
        
        user.password = await bcrypt.hash(user.password, 10)
        
        try {
            this.model.signup(user)
            res.status(201).send({message: "success" })
        }catch(err) {
            res.status(err.status).send({message: err.message})
        }
    }

    async loginUser (req, res) {
        const user = req.body
        if(!user.login || !user.password) {
            res.status(400).send({message: "please fill all the fields"})
        }   
        
        try {
            await this.model.login(user)
            res.status(200).send({message: "success"})
        } catch(err) {
            res.status(400).send({message: err.message})
        }
        
    }
}

export default new userAuthController()