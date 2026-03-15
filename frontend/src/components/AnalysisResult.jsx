import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

const AnimatedScore = ({ score }) => {
    const getColor = (s) => {
        if (s >= 80) return 'var(--success)';
        if (s >= 50) return 'var(--warning)';
        return 'var(--danger)';
    };

    const color = getColor(score);
    const circumference = 2 * Math.PI * 62;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: 150, height: 150, margin: '0 auto' }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
                <circle cx="75" cy="75" r="62" fill="none" stroke="var(--border-color)" strokeWidth="10" />
                <motion.circle
                    cx="75" cy="75" r="62" fill="none"
                    stroke={color} strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                    transform="rotate(-90 75 75)"
                />
            </svg>
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.25rem', fontWeight: 800, color: color
            }}>
                {score}%
            </div>
        </div>
    );
};

const AnalysisResult = ({ result }) => {
    if (!result) return null;

    const getColor = (score) => {
        if (score >= 80) return 'var(--success)';
        if (score >= 50) return 'var(--warning)';
        return 'var(--danger)';
    };

    const cardStyle = {
        background: 'var(--bg-input)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        transition: 'all var(--transition-fast)'
    };

    return (
        <motion.div
            className="glass-card"
            style={{ marginTop: '2rem' }}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
            <motion.h2
                variants={fadeUp}
                style={{
                    borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem',
                    marginBottom: '1.5rem', color: 'var(--text-heading)', fontSize: '1.35rem'
                }}
            >
                Analysis Results
            </motion.h2>

            <motion.div
                variants={fadeUp}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}
            >
                <div style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>ATS Score</h3>
                    <AnimatedScore score={result.atsScore} />
                    <p style={{ marginTop: '1rem', fontWeight: 600, fontSize: '0.9rem' }}>
                        Probability: <span style={{ color: getColor(result.atsScore) }}>{result.selectionProbability}</span>
                    </p>
                </div>

                <div style={{ flex: '2', minWidth: '280px' }}>
                    <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Optimized Summary</h3>
                    <div style={{
                        ...cardStyle,
                        fontStyle: 'italic',
                        lineHeight: 1.7,
                        color: 'var(--text-muted)',
                        fontSize: '0.95rem'
                    }}>
                        "{result.optimizedSummary}"
                    </div>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <motion.div variants={fadeUp} style={cardStyle}>
                    <h4 style={{ color: 'var(--success)', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>✅ Matched Keywords</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {result.keywordMatch?.map((kw, i) => (
                            <span key={i} style={{
                                background: 'var(--success-soft)', color: 'var(--success)',
                                padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 500
                            }}>
                                {kw}
                            </span>
                        )) || <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None</span>}
                    </div>
                </motion.div>

                <motion.div variants={fadeUp} custom={1} style={cardStyle}>
                    <h4 style={{ color: 'var(--danger)', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>⚠️ Missing Skills</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {result.missingSkills?.map((skill, i) => (
                            <span key={i} style={{
                                background: 'var(--danger-soft)', color: 'var(--danger)',
                                padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 500
                            }}>
                                {skill}
                            </span>
                        )) || <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None</span>}
                    </div>
                </motion.div>

                <motion.div variants={fadeUp} custom={2} style={cardStyle}>
                    <h4 style={{ color: 'var(--warning)', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>💡 Improvement Suggestions</h4>
                    <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
                        {result.improvementSuggestions?.map((sugg, i) => (
                            <li key={i} style={{ marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>{sugg}</li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div variants={fadeUp} custom={3} style={cardStyle}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>🎯 Job Recommendations</h4>
                    <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
                        {result.jobRecommendations?.map((rec, i) => (
                            <li key={i} style={{ marginBottom: '0.4rem', fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>
                                <strong style={{ color: 'var(--text-heading)' }}>{rec.role}:</strong> {rec.explanation}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AnalysisResult;
