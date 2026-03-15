import React from 'react';
import { Target, TrendingUp, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';

const ResumeScore = ({ data }) => {
    const { atsScore, keywordMatchPercentage, matchedKeywords, missingKeywords, suggestedProjects, suggestedSkills } = data;

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--success)';
        if (score >= 50) return 'var(--warning)';
        return 'var(--danger)';
    };

    const scoreColor = getScoreColor(atsScore || 0);
    const matchColor = getScoreColor(keywordMatchPercentage || 0);

    return (
        <div className="score-sidebar">
            {/* ATS Score */}
            <div className="score-card">
                <h4><Target size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> ATS Score</h4>
                <div className="score-circle" style={{ border: `8px solid ${scoreColor}` }}>
                    {atsScore || 0}<span style={{ fontSize: '0.9rem' }}>%</span>
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {atsScore >= 80 ? '🎉 Excellent! Highly optimized' :
                     atsScore >= 60 ? '👍 Good, minor improvements possible' :
                     '⚠️ Needs improvement'}
                </p>
            </div>

            {/* Keyword Match */}
            <div className="score-card">
                <h4><TrendingUp size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Keyword Match</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span>Coverage</span>
                    <span style={{ fontWeight: 'bold', color: matchColor }}>{keywordMatchPercentage || 0}%</span>
                </div>
                <div className="keyword-bar">
                    <div className="keyword-bar-fill" style={{ width: `${keywordMatchPercentage || 0}%`, background: `linear-gradient(90deg, ${matchColor}, var(--accent))` }} />
                </div>
            </div>

            {/* Matched Keywords */}
            {matchedKeywords && matchedKeywords.length > 0 && (
                <div className="score-card">
                    <h4 style={{ color: 'var(--success)' }}>✅ Matched Keywords</h4>
                    <div className="tag-list">
                        {matchedKeywords.map((kw, i) => (
                            <span key={i} className="tag-green">{kw}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Missing Keywords */}
            {missingKeywords && missingKeywords.length > 0 && (
                <div className="score-card">
                    <h4 style={{ color: 'var(--danger)' }}><AlertTriangle size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Missing Keywords</h4>
                    <div className="tag-list">
                        {missingKeywords.map((kw, i) => (
                            <span key={i} className="tag-red">{kw}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggested Skills */}
            {suggestedSkills && suggestedSkills.length > 0 && (
                <div className="score-card">
                    <h4 style={{ color: 'var(--primary)' }}><Sparkles size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Suggested Skills</h4>
                    <div className="tag-list">
                        {suggestedSkills.map((s, i) => (
                            <span key={i} className="tag-blue">{s}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggested Projects */}
            {suggestedProjects && suggestedProjects.length > 0 && (
                <div className="score-card">
                    <h4 style={{ color: 'var(--accent)' }}><Lightbulb size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Project Ideas</h4>
                    {suggestedProjects.map((proj, i) => (
                        <div key={i} className="suggestion-card">
                            <h5>{proj.title}</h5>
                            <p>{proj.description}</p>
                            <span className="tech">{proj.techStack}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResumeScore;
