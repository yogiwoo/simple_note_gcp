const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	fullName: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	password: { type: String, required: true },
	timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

