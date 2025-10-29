import { User } from "../models/index.js"

class AccountController {
    async searchUsers(req, res) {
        const { text } = req.params
        const users = await User.find({
            name: { $regex: new RegExp(`^${text}`, 'i') }
        }).select("-password")
        res.send({ users })
    }
    async getUser(req, res) {
        const user = await User.findById(req.params.id).select("-password")
        return res.send({ user })
    }
}

export default new AccountController()