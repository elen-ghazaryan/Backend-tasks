const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); 
const transporter = require("../utils/mailer")
require("dotenv").config()
const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET 
const JWT_EXPIRES_IN = "7d";
const SALT_ROUNDS = 10;
const THIRTY_SECONDS = 30 * 1000;

const signToken = (userId) => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

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

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ error: "firstName, lastName, email, password are required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword, // store hashed password
    });

    const token = signToken(user.id);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", isBlocked,  async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });

    const user = req.user;

    

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      user.attempts += 1
      await user.save()

      if(user.attempts > 2) {
        user.isBlocked = true
        user.blockedTime = new Date()
        user.attempts = 0;
        await user.save()
        return res.status(400).json({error: "Request is blocked"})
      }
      
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user.id);
    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "firstName", "lastName", "email", "isEmailVerified"],
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    
    // If the email is already verified
     if (user.isEmailVerified) {
        return res.json({ 
            id: user.id, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            email: user.email,
            message: "Email is already verified."
        });
    }

    // Short-lived verification token
    const verificationToken = jwt.sign(
      { sub: user.id },
      process.env.JWT_EMAIL_SECRET,
      { expiresIn: '1h'} 
    );


    const verificationLink = `http://localhost:4002/auth/verify?token=${verificationToken}`;


    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Confirm your email",
      html: `
      <h2>Hello!</h2>
      <p>Click the link below to confirm your email:</p>
      <a href="${verificationLink}" style="
        display:inline-block;
        background-color:#4CAF50;
        color:white;
        padding:10px 20px;
        text-decoration:none;
        border-radius:5px;
      ">Confirm Email</a>
      <p>If you didn’t request this, you can ignore this message.</p>
    `,
    })
    
    res.json({ message: "Check your email, to confirm it" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load user" });
  }
});


router.get("/verify", async (req, res) => {
  const { token } = req.query;  // get the token from the URL

  if(!token) {
    res.status(400).send("Missing verification token")
  }

  try {
    const { sub: userId } = jwt.verify(token, process.env.JWT_EMAIL_SECRET);

    const user = await User.findByPk(userId);
    if(!user) {
      return res.status(404).send("User not found or invalid token payload")
    }

    if(user.isEmailVerified) {
      return res.send("Email already confirmed! You can close this window")
    }

    await user.update({ isEmailVerified: true })
    res.json({
      message: "Your email has been successfully verified!",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch(err) {
    console.error(err)
    res.status(401).send("Invalid or expired verification link")
  }
})

module.exports = router;
