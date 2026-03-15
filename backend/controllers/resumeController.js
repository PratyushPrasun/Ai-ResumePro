const pdfParse = require('pdf-parse-new');
const Analysis = require('../models/Analysis');
const { analyzeResumeWithAI } = require('../services/aiService');

exports.analyzeResume = async (req, res) => {
    try {
        const file = req.file;
        const { jobDescription } = req.body;

        if (!file) {
            return res.status(400).json({ msg: 'Please upload a resume file (PDF)' });
        }

        if (!jobDescription) {
            return res.status(400).json({ msg: 'Please provide a target job description' });
        }

        // Parse PDF text
        const pdfData = await pdfParse(file.buffer);
        const resumeText = pdfData.text;

        // Call AI Service
        const aiResult = await analyzeResumeWithAI(resumeText, jobDescription);

        // Save to Database
        let analysis = new Analysis({
            user: req.user.id,
            jobDescription,
            resumeText,
            atsScore: aiResult.atsScore,
            keywordMatch: aiResult.keywordMatch,
            missingSkills: aiResult.missingSkills,
            improvementSuggestions: aiResult.improvementSuggestions,
            selectionProbability: aiResult.selectionProbability,
            jobRecommendations: aiResult.jobRecommendations,
            optimizedSummary: aiResult.optimizedSummary
        });

        await analysis.save();

        res.json({
            msg: 'Resume analyzed successfully',
            data: analysis
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: err.message || 'Server Error during analysis' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const analyses = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(analyses);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error fetching history' });
    }
};
