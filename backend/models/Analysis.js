const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    resumeText: {
        type: String,
        required: true
    },
    atsScore: {
        type: Number,
        required: true
    },
    keywordMatch: {
        type: [String],
        default: []
    },
    missingSkills: {
        type: [String],
        default: []
    },
    improvementSuggestions: {
        type: [String],
        default: []
    },
    selectionProbability: {
        type: String,
        default: 'Low'
    },
    jobRecommendations: [
        {
            role: String,
            explanation: String
        }
    ],
    optimizedSummary: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('analysis', AnalysisSchema, 'resume_analyzer_analyses');
