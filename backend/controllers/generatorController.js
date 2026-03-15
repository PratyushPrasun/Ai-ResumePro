const pdfParse = require('pdf-parse-new');
const mammoth = require('mammoth');
const GeneratedResume = require('../models/GeneratedResume');
const { optimizeResume, optimizeFromText } = require('../services/resumeGeneratorService');
const { generateResumePDF } = require('../services/pdfGeneratorService');

/**
 * POST /api/generator/generate
 * Accepts either uploaded file (PDF/DOCX) + targetJobRole
 * or JSON body with structured inputData + targetJobRole
 */
exports.generate = async (req, res) => {
    try {
        const { targetJobRole } = req.body;

        if (!targetJobRole) {
            return res.status(400).json({ msg: 'Target job role is required.' });
        }

        let aiResult;
        let mode;
        let inputData;

        if (req.file) {
            // ── Upload mode ──
            mode = 'upload';
            let resumeText = '';

            if (req.file.mimetype === 'application/pdf') {
                const pdfData = await pdfParse(req.file.buffer);
                resumeText = pdfData.text;
            } else if (
                req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                req.file.originalname.endsWith('.docx')
            ) {
                const result = await mammoth.extractRawText({ buffer: req.file.buffer });
                resumeText = result.value;
            } else {
                return res.status(400).json({ msg: 'Only PDF and DOCX formats are supported.' });
            }

            if (!resumeText || resumeText.trim().length < 50) {
                return res.status(400).json({ msg: 'Could not extract enough text from the uploaded file.' });
            }

            aiResult = await optimizeFromText(resumeText, targetJobRole);
            inputData = aiResult.inputData;
        } else {
            // ── From-scratch mode ──
            mode = 'scratch';
            const parsedInput = typeof req.body.inputData === 'string' 
                ? JSON.parse(req.body.inputData) 
                : req.body.inputData;

            if (!parsedInput || !parsedInput.fullName) {
                return res.status(400).json({ msg: 'Resume input data is required when not uploading a file.' });
            }

            inputData = parsedInput;
            aiResult = await optimizeResume(inputData, targetJobRole);
        }

        // Save to database
        const generated = new GeneratedResume({
            user: req.user.id,
            mode,
            targetJobRole,
            inputData,
            optimizedResume: aiResult.optimizedResume,
            atsScore: aiResult.atsScore,
            keywordMatchPercentage: aiResult.keywordMatchPercentage,
            matchedKeywords: aiResult.matchedKeywords,
            missingKeywords: aiResult.missingKeywords,
            suggestedProjects: aiResult.suggestedProjects,
            suggestedSkills: aiResult.suggestedSkills
        });

        await generated.save();

        res.json({
            msg: 'Resume generated and optimized successfully',
            data: generated
        });
    } catch (err) {
        console.error('Generator error:', err.message);
        res.status(500).json({ msg: err.message || 'Server error during resume generation' });
    }
};

/**
 * POST /api/generator/download/:id
 * Accepts optional body with edited optimizedResume to use for PDF
 * Otherwise uses the stored version
 */
exports.download = async (req, res) => {
    try {
        const record = await GeneratedResume.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!record) {
            return res.status(404).json({ msg: 'Resume not found.' });
        }

        // Allow user to send edited version for PDF generation
        const resumeData = req.body.optimizedResume || record.optimizedResume;

        const pdfBuffer = await generateResumePDF(resumeData);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${(resumeData.fullName || 'resume').replace(/\s+/g, '_')}_Resume.pdf"`,
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.error('PDF download error:', err.message);
        res.status(500).json({ msg: err.message || 'Server error during PDF generation' });
    }
};

/**
 * GET /api/generator/history
 * Returns all generated resumes for the authenticated user
 */
exports.history = async (req, res) => {
    try {
        const resumes = await GeneratedResume.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select('-inputData'); // exclude large inputData from listing
        res.json(resumes);
    } catch (err) {
        console.error('History error:', err.message);
        res.status(500).json({ msg: 'Server error fetching resume history' });
    }
};
