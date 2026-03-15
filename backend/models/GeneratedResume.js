const mongoose = require('mongoose');

const GeneratedResumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    mode: {
        type: String,
        enum: ['upload', 'scratch'],
        required: true
    },
    targetJobRole: {
        type: String,
        required: true
    },
    inputData: {
        fullName: String,
        phone: String,
        email: String,
        linkedIn: String,
        github: String,
        skills: [String],
        experience: [{
            role: String,
            company: String,
            duration: String,
            responsibilities: String,
            achievements: String
        }],
        education: [{
            degree: String,
            institution: String,
            year: String,
            score: String
        }],
        projects: [{
            title: String,
            techStack: String,
            description: String,
            impact: String
        }],
        certifications: [String],
        achievements: [String]
    },
    optimizedResume: {
        fullName: String,
        phone: String,
        email: String,
        linkedIn: String,
        github: String,
        professionalSummary: String,
        skills: [String],
        experience: [{
            role: String,
            company: String,
            duration: String,
            bullets: [String]
        }],
        projects: [{
            title: String,
            techStack: String,
            bullets: [String]
        }],
        education: [{
            degree: String,
            institution: String,
            year: String,
            score: String
        }],
        certifications: [String],
        achievements: [String]
    },
    atsScore: {
        type: Number,
        default: 0
    },
    keywordMatchPercentage: {
        type: Number,
        default: 0
    },
    matchedKeywords: {
        type: [String],
        default: []
    },
    missingKeywords: {
        type: [String],
        default: []
    },
    suggestedProjects: [{
        title: String,
        description: String,
        techStack: String
    }],
    suggestedSkills: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('generatedResume', GeneratedResumeSchema, 'resume_analyzer_generated');
