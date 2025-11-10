// External modules
const express = require('express');
const { getAllPartnerProfiles, getPartnerProfileBasedOnQuery } = require('../controllers/basePartner.controller');

const router = express.Router();

router.get('/all', getAllPartnerProfiles);
router.get('/query', getPartnerProfileBasedOnQuery);

module.exports = router;
