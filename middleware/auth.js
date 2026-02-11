const jwt = require('jsonwebtoken')
const User = require('./../modles/users')

async function authorize(req, res, next) {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization
        if (!authHeader) return res.status(401).json({ message: 'JSON Web Token not provided' })

        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
        const secret = process.env.JWT_SECRET || 'change_this_secret'

        const decoded = jwt.verify(token, secret)
        if (!decoded || !decoded.id) return res.status(401).json({ message: 'Invalid token' })

        // optional: verify user exists
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).json({ message: 'Invalid token - user not found' })

        // attach id and user info to request for downstream handlers
        req.id = String(user._id)
        req.user = { id: req.id, email: user.email, fullName: user.fullName || user.fullname }

        return next()
    } catch (err) {
        console.error('auth error:', err)
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

module.exports = authorize