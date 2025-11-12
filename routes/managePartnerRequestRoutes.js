// External modules
const express = require('express');

// Local modules
const { sendPartnerRequest, checkPartnerRequest, allRequests, removeConnection, updatePartnerProfile } = require('../controllers/magagePartner.controller');

const router = express();

router.post('/send-request', sendPartnerRequest);
router.post('/check-request', checkPartnerRequest);
router.get('/all-requests', allRequests);
router.post('/remove-connection', removeConnection);
router.post('/update-partner-profile', updatePartnerProfile);

module.exports = router;
