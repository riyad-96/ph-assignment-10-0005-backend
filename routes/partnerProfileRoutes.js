// External modules
const express = require('express');

// Local modules
const { createPartnerProfile, getPartnerProfileData, updatePartnerProfileData } = require('../controllers/partnerProfile.controller');

const router = express.Router();

router.get('/get', getPartnerProfileData);
router.post('/create', createPartnerProfile);
router.post('/update', updatePartnerProfileData);

module.exports = router;
