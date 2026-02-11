const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    userId: { type: String, required: true, trim: true ,ref:"User"},
    notes: { type: String, required: true, unique: true, lowercase: true, trim: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notes', notesSchema);

