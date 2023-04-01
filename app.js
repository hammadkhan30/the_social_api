const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const friendsRoutes = require('./routes/friendRoutes');
const search = require('./routes/searchRoutes');

mongoose.set('strictQuery', true);

require('dotenv').config();

const MONGO_URL = process.env.mongo;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Mongo database connected');
}).catch((err) => {
    console.log('Database could not be connected', err);
});

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON received:', req.body);
      res.status(400).json({ error: 'Invalid JSON' });
    } else {
      next(error);
    }
  });

app.use('/users', userRoutes);
app.use('/post',postRoutes);
app.use('/friends',friendsRoutes);
app.use('/search',search)

app.get('/', (req, res) => {
    res.send('you are in');
});

module.exports = app;
