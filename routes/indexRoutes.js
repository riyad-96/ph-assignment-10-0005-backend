// External modules
const express = require('express');

// Local modules
const userRouter = require('./userRoutes');
const basePartnerRouter = require('./basePartnerRoutes');
const partnerProfileRouter = require('./partnerProfileRoutes');
const verifyFirebaseAccessToken = require('../middlewares/verifyFirebaseAccessToken');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Server is live');
});

router.use('/user', userRouter);
router.use('/base-partner', basePartnerRouter);
router.use('/partner-profile', verifyFirebaseAccessToken, partnerProfileRouter);

module.exports = router;
