const express = require('express')
const Notes = require('../modles/notes')

const notesRouter = express.Router()

// GET /notes/getMyNotes?userId=...
notesRouter.get('/getMyNotes', async (req, res) => {
  try {
    const userId = req.query.userId || req.body?.userId || req.headers['userid'] || req.userId || (req.user && req.user.id)
    if (!userId) return res.status(400).json({ error: 'userId is required' })

    const notes = await Notes.find({ userId }).populate('userId')
    return res.status(200).json(notes)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /notes/createANote  { notes: 'text' }
notesRouter.post('/createANote', async (req, res) => {
  try {
    const userId = req.id || req.body?.userId || req.query?.userId || req.headers['userid'] || req.userId || (req.user && req.user.id)
    if (!userId) return res.status(400).json({ error: 'userId is required' })

    const { notes } = req.body
    if (!notes) return res.status(400).json({ error: 'notes is required in body' })

    const newNote = new Notes({ userId, notes })
    const saved = await newNote.save()
    return res.status(201).json(saved)
  } catch (err) {
    console.error(err)
    if (err.code === 11000) return res.status(409).json({ error: 'Duplicate note' })
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = notesRouter