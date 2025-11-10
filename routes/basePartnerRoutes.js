// External modules
const express = require('express');
const { getDB } = require('../db/establishConnection');

// Local modules

const router = express.Router();

router.get('/all', async (req, res) => {
  const db = getDB();
  const collection = db.collection('basepartners');
  const partners = await collection.find().toArray();

  res.send(partners);
});

module.exports = router;
