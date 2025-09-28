import User from "../models/user.js"
import Validator  from "../lib/validator.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

class UserAuthController {
  async signup(req, res){
    
    /* VALIDATIONS */

    if(!req.body) return res.status(400).send({message: "Request payload is missing"})
      
    const required = ["name", "surname", "login", "password"];
    const missing = required.filter(key => !req.body[key]);

    if (missing.length > 0) {
      return res.status(400).send({
        message: `Missing fields: ${missing.join(", ")}`
      });
    }

    const { name, surname, login, password } = req.body

    const existingUser = await User.findOne({
      where: { login }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Login already     taken" });
    }

    if(!Validator.isStrongPassword(password)) {
      return res.status(400).send({
         message: "Password must be at least 8 characters long, and include uppercase, lowercase, and a special symbol."
      });
    }

    /* PASSWORD HASHING */
  const hashPassword = await bcrypt.hash(password, 10)


    /* NEW USER CREATING IN DB*/
    try {
      const newUser = await User.create({
        name: name,
        surname: surname,
        login: login,
        password: hashPassword, 
        isPrivate: false,
        cover_picture: null,
        profile_picture: null
      });

      return res.status(201).send({message: "User successfully created"})
    } catch(err) {
      console.log("Error creating user: ", err)

      return res.status(500).send({message: "Something went wrong while creating the user."})
    }
  }

  async login(req, res) {
    /*  VALIDATIONS  */
    if(!req.body) return res.status(400).send({message: "Payload is missing"})
    const {login, password} = req.body
    if(!login || !password) {
      return res.status(400).send({message: "Invalid request. Not fully credentials."})
    }

    const user = await User.findOne({ where: { login } });
    if(!user) return res.status(401).send({ message: "Invalid login or password" });
  
    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword) return res.status(401).send({ message: "Invalid login or password" })

    /* GENERATING TOKEN */
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.status(200).send({ accessToken })
  }

  async getUser(req, res) {
    const { name, surname, login } = req.user;
    res.status(200).send({ user: { name, surname, login }})
  }
}

export default new UserAuthController()