// External modules
const express = require('express');

// Local modules
const verifyFirebaseAccessToken = require('../middlewares/verifyFirebaseAccessToken');
const basePartnerRouter = require('./basePartnerRoutes');
const partnerProfileRouter = require('./partnerProfileRoutes');
const managePartnerRouter = require('./managePartnerRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Server is live');
});

router.use('/base-partner', basePartnerRouter);
router.use('/partner-profile', verifyFirebaseAccessToken, partnerProfileRouter);
router.use('/partner-request', verifyFirebaseAccessToken, managePartnerRouter);

module.exports = router;
