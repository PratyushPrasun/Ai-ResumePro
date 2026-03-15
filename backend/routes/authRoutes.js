const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post('/register', authController.registerUser);

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post('/login', authController.loginUser);

// @route    GET api/auth/me
// @desc     Get logged in user
// @access   Private
router.get('/me', auth, authController.getUser);

module.exports = router;
