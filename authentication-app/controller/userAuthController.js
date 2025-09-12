import { getUserByLogin } from "../lib/db.js"
import userAuthModel from "../model/userAuthModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


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
            await this.model.signup(user)
            res.status(201).send({message: "Signup success" })
        }catch(err) {
            res.status(err.status).send({message: err.message})
        }
    }

    async loginUser (req, res) {
        if(!req.body) res.status(400).send({message: "Empty object"})
       
        const user = req.body
        if(!user.login || !user.password) {
            return res.status(400).send({message: "please fill all the fields"})
        }   
        
        try {
            const found = await this.model.login(user)
            const token = jwt.sign({ id:found.id }, process.env.JWT_SECRET, {expiresIn: '10h'})
            res.status(200).send({ token })

        } catch(err) {
            res.status(400).send({message: err.message})
        }
        
    }
    
    async sendUserData (req, res) {
        const { id, name, surname, login } = req.user
        res.status(200).send({user: { id, name, surname, login }})
    }
}

export default new userAuthController()