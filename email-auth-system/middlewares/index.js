const { User } = require("../models"); 
require("dotenv").config()
const jwt = require('jsonwebtoken')
const THIRTY_SECONDS = 30 * 1000;
const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const [scheme, token] = hdr.split(" ");
  if (scheme !== "Bearer" || !token)
    return res.status(401).json({ error: "Missing Bearer token" });

  try {
    const { sub } = jwt.verify(token, JWT_SECRET);
    req.userId = sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const isBlocked = async (req, res, next) => {
  const { email } = req.body
  if(!email)  return res.status(400).json({ error: "email and password are required" });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error:  "Invalid credentials" });

  if(user.isBlocked) {
    let now = new Date()
    let blockedTime = new Date(user.blockedTime);

    if(now - blockedTime > THIRTY_SECONDS) {
      user.isBlocked = false;
      user.time = null;
      await user.save();
    } else {
      return res.status(400).json({ error: "Request is blocked, wait 30 seconds."})
    }
  }
  
  req.user = user
  next()
}

module.exports = {auth, isBlocked}