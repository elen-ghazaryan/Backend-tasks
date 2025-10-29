import { User } from "../models/index.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

class UserController {
    async signup(req, res) {
        let { name, surname, username, password } = req.body
        try {
            password = await bcrypt.hash(password, 10)

            const user = await User.create({ name, surname, username, password })
            return res.status(201).send({ ok: true, _id: user._id })
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }
    }

    async login(req, res) {
        const { username, password } = req.body
        try {
            if (!username || !password) {
                return res.status(400).send({ message: "Username and password are required" })
            }

            const user = await User.findOne({ username })
            if (!user) return res.status(401).send({ message: "Invalid credentials" })

            const valid = await bcrypt.compare(password, user.password)
            if (!valid) return res.status(401).send({ message: "Invalid credentials" })

            const token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            )

            return res.status(200).send({ ok: true, token })

        } catch (err) {
            return res.status(400).send({ message: err.message })
        }
    }

    async getUser(req, res) {
        try {
            const header = req.headers.authorization || ""
            const [, token] = header.split(" ")
            if (!token) return res.status(401).send({ message: "Missing token" })

            const decoded = jwt.verify(token, env.JWT_SECRET)
            const user = await User.findById(decoded.id).select("-password")
            if (!user) return res.status(404).send({ message: "User not found" })

            return res.status(200).send({ ok: true, user })
        } catch (err) {
            return res.status(401).send({ message: "Unauthorized" })
        }
    }

    async uploadAvatar(req, res) {
        const id = req.user._id
        const user = await User.findById(id)
        user.avatar = req.file.filename
        await user.save()
        res.send({ picture: req.file.filename })
    }

    async switchPrivacy(req, res) {
        const user = await User.findById(req.user.id)
        user.isPrivate = !user.isPrivate
        await user.save()
        res.send({ isPrivate: user.isPrivate })
    }
}

export default new UserController()