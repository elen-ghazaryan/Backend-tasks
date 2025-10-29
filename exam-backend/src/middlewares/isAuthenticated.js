import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
export async function isAuthenticated(req, res, next) {
     try {
          const header = req.headers.authorization || ""
          const [, token] = header.split(" ")
          if (!token) return res.status(401).send({ message: "Missing token" })

          const decoded = jwt.verify(token, process.env.JWT_SECRET)

          const user = await User.findById(decoded.id).select("-password")
          if (!user) return res.status(401).send({ message: "Invalid token" })

          req.user = user
          next()
     } catch (err) {
          return res.status(401).send({ message: "Unauthorized" })
     }
}