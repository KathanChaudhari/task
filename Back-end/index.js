const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());


const dotenv = require('dotenv');
dotenv.config();


const dbURI = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.4xz27q5.mongodb.net/?retryWrites=true&w=majority`; // Replace with your database URI
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: { type: Number, required: true },
});

const Person = mongoose.model('Person', personSchema);

app.get('/api/people', async (req, res) => {
  try {
    const people = await Person.find().sort({ rank: 1 }).exec();
    res.json(people);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/people', async (req, res) => {
  const { name, rank } = req.body;
  if (!name || !rank) {
    res.status(400).json({ error: 'Name and rank are required' });
    return;
  }
  const person = new Person({ name, rank });
  try {
    await person.save();
    res.json(person);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.put('/api/people/:id', async (req, res) => {
  const { id } = req.params;
  const { name, rank } = req.body;
  if (!name || !rank) {
    res.status(400).json({ error: 'Name and rank are required' });
    return;
  }
  try {
    const person = await Person.findByIdAndUpdate(id, { name, rank }, { new: true });
    res.json(person);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.delete('/api/people/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const person = await Person.findByIdAndDelete(id);
    res.json(person);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


const port = process.env.PORT ;
app.listen(port, () => console.log(`Server listening on port ${port}`));
