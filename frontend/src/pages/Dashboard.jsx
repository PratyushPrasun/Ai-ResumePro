import React, { useState } from 'react';
import api from '../api/axios';
import AnalysisResult from '../components/AnalysisResult';
import { UploadCloud, Loader, FileSearch, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const shimmerStyle = {
    background: 'linear-gradient(90deg, var(--bg-input) 25%, var(--border-color) 50%, var(--bg-input) 75%)',
    backgroundSize: '400% 100%',
    animation: 'shimmer 1.5s ease-in-out infinite',
    borderRadius: 'var(--radius-sm)'
};

const SkeletonLoader = () => (
    <div className="glass-card" style={{ marginTop: '2rem' }}>
        <div style={{ ...shimmerStyle, height: 28, width: '40%', marginBottom: '1.5rem' }} />
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ ...shimmerStyle, width: 140, height: 140, borderRadius: '50%' }} />
                <div style={{ ...shimmerStyle, height: 16, width: 120 }} />
            </div>
            <div style={{ flex: 2, minWidth: 250 }}>
                <div style={{ ...shimmerStyle, height: 16, width: '70%', marginBottom: '0.75rem' }} />
                <div style={{ ...shimmerStyle, height: 80, width: '100%' }} />
            </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ ...shimmerStyle, height: 100 }} />
            ))}
        </div>
    </div>
);

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);

        if (!file) {
            setError('Please upload a resume PDF.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        try {
            setLoading(true);
            const res = await api.post('/resume/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error processing analysis. Please ensure it is a valid PDF and the server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <motion.h1
                    style={{ marginBottom: '0.5rem', fontWeight: 800, fontSize: '2.25rem', color: 'var(--text-heading)' }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <FileSearch size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                    AI Resume <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analyzer</span>
                </motion.h1>
                <motion.p
                    style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Upload your resume and the target job description to get instant, actionable feedback.
                </motion.p>
            </div>

            <motion.div
                className="glass-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
            >
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label-text">1. Upload Resume (PDF only)</label>
                        <div style={{
                            border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)',
                            padding: '2rem', textAlign: 'center', cursor: 'pointer',
                            background: 'var(--bg-input)', transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-soft)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-input)'; }}
                        onClick={() => document.getElementById('fileUpload').click()}
                        >
                            <UploadCloud size={44} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
                            <p style={{ color: file ? 'var(--success)' : 'var(--text-muted)', fontWeight: file ? 600 : 400 }}>
                                {file ? `✓ ${file.name}` : 'Click to browse or drag and drop your PDF here'}
                            </p>
                            <input
                                id="fileUpload"
                                type="file"
                                accept="application/pdf"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label-text">2. Target Job Description</label>
                        <textarea
                            className="input-field"
                            rows="6"
                            placeholder="Paste the job requirements and description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            required
                            style={{ resize: 'vertical', marginBottom: 0 }}
                        ></textarea>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    color: 'var(--danger)', background: 'var(--danger-soft)',
                                    padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
                                    marginBottom: '1rem', fontSize: '0.9rem'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div style={{ textAlign: 'center' }}>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', padding: '0.85rem 2rem' }}>
                            {loading ? (
                                <>
                                    <Loader className="animate-spin" size={20} /> Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} /> Analyze Resume
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>

            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <SkeletonLoader />
                    </motion.div>
                )}

                {!loading && result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <AnalysisResult result={result} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dashboard;
