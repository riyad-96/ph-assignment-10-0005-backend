// External modules
const express = require('express');

// Local modules
const userRouter = require('./userRoutes');
const basePartnerRouter = require('./basePartnerRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  console.log(res.locals);
  res.send('Server is live');
});

router.use('/user', userRouter);
router.use('/base-partner', basePartnerRouter);

module.exports = router;
