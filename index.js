// External modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Local modules
const indexRouter = require('./routes/indexRoutes');
const { establishDBConnection } = require('./db/establishConnection');

const app = express();

// Middlewares
app.use(
  cors({
    origin: ['http://localhost:5173/', 'http://192.168.0.200:5173/'],
    credentials: true,
  })
);
app.use(express.json());

// Route
app.use(indexRouter);

// database connection
const PORT = process.env.PORT;

establishDBConnection((err) => {
  if (err) return console.error(err);

  app.listen(PORT, () => {
    console.log('Server started');
  });
});
