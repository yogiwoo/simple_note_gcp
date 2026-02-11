const express = require('express')
const userModel = require('./../modles/users')
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

userRouter.post('/register', async (req, res) => {
    try {
        let user = new userModel({
            fullName: req.body.fullName,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10)
        })
        const saved = await user.save()
        if (saved) {
            return res.status(200).json({ message: "registration success" })
        }
        else {
            return res.status(500).json({ message: "internal server error" })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

userRouter.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) return res.status(404).json({ message: 'user not found' })

        const comparison = await bcrypt.compare(req.body.password, user.password)
        if (!comparison) return res.status(401).json({ message: 'invalid credentials' })

        const payload = { id: user._id, email: user.email }
        const secret = process.env.JWT_SECRET || 'change_this_secret'
        const token = jwt.sign(payload, secret, { expiresIn: '1h' })

        const username = user.fullname || user.fullName || user.email
        return res.status(200).json({ username, email: user.email, token })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = userRouter;