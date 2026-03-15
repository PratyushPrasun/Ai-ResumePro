const express = require('express');
const router = express.Router();
const multer = require('multer');
const generatorController = require('../controllers/generatorController');
const auth = require('../middleware/authMiddleware');

// Configure Multer — accept PDF and DOCX
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowed = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowed.includes(file.mimetype) || file.originalname.endsWith('.docx')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX formats are supported!'), false);
        }
    }
});

// @route   POST /api/generator/generate
// @desc    Generate optimized resume (upload file or from-scratch JSON)
// @access  Private
router.post('/generate', auth, upload.single('resume'), generatorController.generate);

// @route   POST /api/generator/download/:id
// @desc    Download resume as PDF (optionally with edited content)
// @access  Private
router.post('/download/:id', auth, generatorController.download);

// @route   GET /api/generator/history
// @desc    Get generated resume history
// @access  Private
router.get('/history', auth, generatorController.history);

module.exports = router;
