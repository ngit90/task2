const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors(

));

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/userdatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: {type: Number, required: true},
  email: { type: String, required: true },
  id:{ type: Number, required: true}
});

const User = mongoose.model('User', userSchema);

// API Endpoints

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Add a new user
app.post('/api/users', async (req, res) => {
  const { name,age, email, id } = req.body;
  if (!name|| !age || !email ||!id) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  try {
    const newUser = new User({ name, age, email, id });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Edit an existing user
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, email } = req.body;

  if (!name || !age || !email) {
    return res.status(400).json({ error: 'Name, age, email are required' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, age, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({message : "updated success"});
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
