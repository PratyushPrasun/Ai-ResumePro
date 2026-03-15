import React, { useState } from 'react';
import api from '../api/axios';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import ResumeScore from '../components/ResumeScore';
import { UploadCloud, FileText, PenTool, Sparkles, CheckCircle } from 'lucide-react';
import './ResumeGenerator.css';

const ResumeGenerator = () => {
    const [mode, setMode] = useState('scratch'); // 'scratch' or 'upload'
    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // Handle from-scratch submission
    const handleScratchSubmit = async ({ inputData, targetJobRole }) => {
        setError('');
        setResult(null);
        setLoading(true);
        setLoadingStep(0);

        try {
            const timer1 = setTimeout(() => setLoadingStep(1), 2000);
            const timer2 = setTimeout(() => setLoadingStep(2), 5000);
            const timer3 = setTimeout(() => setLoadingStep(3), 9000);

            const res = await api.post('/generator/generate', {
                inputData,
                targetJobRole
            });

            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            setResult(res.data.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to generate resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle upload submission
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a resume file.');
            return;
        }
        if (!targetRole.trim()) {
            setError('Please enter a target job role.');
            return;
        }

        setError('');
        setResult(null);
        setLoading(true);
        setLoadingStep(0);

        try {
            const timer1 = setTimeout(() => setLoadingStep(1), 2000);
            const timer2 = setTimeout(() => setLoadingStep(2), 6000);
            const timer3 = setTimeout(() => setLoadingStep(3), 10000);

            const formData = new FormData();
            formData.append('resume', file);
            formData.append('targetJobRole', targetRole);

            const res = await api.post('/generator/generate', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            setResult(res.data.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to process resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadingSteps = [
        'Parsing your resume data...',
        'Analyzing target job role requirements...',
        'Optimizing content with AI...',
        'Generating ATS-friendly format...'
    ];

    return (
        <div className="generator-page">
            <h1>
                ATS Resume <span style={{ color: 'var(--primary)' }}>Generator</span>
            </h1>
            <p className="subtitle">
                Create an AI-optimized, ATS-friendly resume tailored to your target role
            </p>

            {/* Mode Toggle */}
            {!result && !loading && (
                <div className="mode-toggle">
                    <button
                        className={`mode-btn ${mode === 'scratch' ? 'active' : ''}`}
                        onClick={() => { setMode('scratch'); setError(''); }}
                    >
                        <PenTool size={18} /> Build From Scratch
                    </button>
                    <button
                        className={`mode-btn ${mode === 'upload' ? 'active' : ''}`}
                        onClick={() => { setMode('upload'); setError(''); }}
                    >
                        <UploadCloud size={18} /> Upload Resume
                    </button>
                </div>
            )}

            {error && (
                <div className="glass-card" style={{ borderLeft: '4px solid var(--danger)', margin: '1rem 0' }}>
                    <p style={{ color: 'var(--danger)' }}>{error}</p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="glass-card generator-loading">
                    <div className="spinner" />
                    <p><Sparkles size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />AI is crafting your perfect resume...</p>
                    <div className="loading-steps">
                        {loadingSteps.map((step, i) => (
                            <div key={i} className={`step ${i <= loadingStep ? 'done' : ''}`}>
                                {i <= loadingStep ? <CheckCircle size={16} /> : <span style={{ width: 16, height: 16, display: 'inline-block' }} />}
                                {step}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Form Area */}
            {!result && !loading && (
                <>
                    {mode === 'scratch' && (
                        <ResumeForm onSubmit={handleScratchSubmit} loading={loading} />
                    )}

                    {mode === 'upload' && (
                        <div className="glass-card">
                            <form onSubmit={handleUploadSubmit}>
                                <div className="target-role-input">
                                    <label>🎯 Target Job Role *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Senior Frontend Developer, Data Scientist..."
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        required
                                    />
                                </div>

                                <div
                                    className="upload-area"
                                    onClick={() => document.getElementById('generatorFileUpload').click()}
                                >
                                    <UploadCloud size={48} color="var(--primary)" />
                                    {file ? (
                                        <p className="file-name"><FileText size={16} style={{ verticalAlign: 'middle' }} /> {file.name}</p>
                                    ) : (
                                        <p>Click to upload your resume (PDF or DOCX)</p>
                                    )}
                                    <input
                                        id="generatorFileUpload"
                                        type="file"
                                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <button type="submit" className="btn-primary" style={{ fontSize: '1.1rem', padding: '0.9rem 2.5rem' }}>
                                        ✨ Generate Optimized Resume
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </>
            )}

            {/* Results */}
            {result && !loading && (
                <div className="results-container">
                    <div className="results-header">
                        <h2>Your AI-Optimized Resume</h2>
                        <button
                            className="btn-primary btn-outline"
                            onClick={() => { setResult(null); setFile(null); setTargetRole(''); }}
                        >
                            ← Generate Another Resume
                        </button>
                    </div>
                    <div className="results-grid">
                        <ResumePreview data={result.optimizedResume} resumeId={result._id} />
                        <ResumeScore data={result} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeGenerator;
