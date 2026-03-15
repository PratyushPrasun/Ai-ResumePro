const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/authMiddleware');

// Configure Multer for memory storage structure
const storage = multer.memoryStorage();
const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF format is supported!'), false);
        }
    } 
});

// @route    POST api/resume/analyze
// @desc     Upload resume and analyze vs Job Description
// @access   Private
router.post('/analyze', auth, upload.single('resume'), resumeController.analyzeResume);

// @route    GET api/resume/history
// @desc     Get all past analyses for user
// @access   Private
router.get('/history', auth, resumeController.getHistory);

module.exports = router;
