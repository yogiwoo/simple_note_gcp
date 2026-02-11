const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 4005;
const notesRouter = require('./routes/notes');
const userRouter=require('./routes/auth')
const authorize=require('./middleware/auth')
// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
}).then(() => {
  console.log('MongoDB connected successfully',MONGO_URI);
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// parse JSON bodies
app.use(express.json())

app.use('/notes',authorize, notesRouter);
app.use('/users', userRouter)
app.get('/', (req, res) => {
	res.send('Hello World');
});

app.listen(PORT,"0.0.0.0", () => {
	console.log(`Server listening on port ${PORT}`);
});

module.exports = app;

