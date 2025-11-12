// External modules
const express = require('express');

// Local modules
const { createUserProfile, getUserData, updateUserProfileData } = require('../controllers/user.controller');

const router = express.Router();

router.get('/get', getUserData);
router.post('/create', createUserProfile);
router.post('/update', updateUserProfileData);

module.exports = router;
