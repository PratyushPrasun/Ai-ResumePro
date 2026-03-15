import React, { useState, useCallback } from 'react';
import { Download, Edit3 } from 'lucide-react';
import api from '../api/axios';

const ResumePreview = ({ data, resumeId }) => {
    const [resume, setResume] = useState(data);
    const [downloading, setDownloading] = useState(false);

    const handleEdit = useCallback((section, index, field, value) => {
        setResume(prev => {
            const updated = { ...prev };
            if (index !== null && index !== undefined) {
                const arr = [...(updated[section] || [])];
                if (field === null) {
                    arr[index] = value;
                } else {
                    arr[index] = { ...arr[index], [field]: value };
                }
                updated[section] = arr;
            } else {
                updated[section] = value;
            }
            return updated;
        });
    }, []);

    const handleBulletEdit = useCallback((section, itemIdx, bulletIdx, value) => {
        setResume(prev => {
            const updated = { ...prev };
            const arr = [...(updated[section] || [])];
            const item = { ...arr[itemIdx] };
            const bullets = [...(item.bullets || [])];
            bullets[bulletIdx] = value;
            item.bullets = bullets;
            arr[itemIdx] = item;
            updated[section] = arr;
            return updated;
        });
    }, []);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            const response = await api.post(`/generator/download/${resumeId}`, 
                { optimizedResume: resume },
                { responseType: 'blob' }
            );
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${(resume.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Download failed:', err);
            alert('Failed to download PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const contactParts = [resume.phone, resume.email, resume.linkedIn, resume.github].filter(Boolean);

    return (
        <div className="resume-preview">
            <div className="preview-actions">
                <h3><Edit3 size={16} /> Click any text to edit</h3>
                <button className="download-btn" onClick={handleDownload} disabled={downloading}>
                    <Download size={16} />
                    {downloading ? 'Generating PDF...' : 'Download PDF'}
                </button>
            </div>

            {/* Header */}
            <h2 className="resume-name"
                contentEditable suppressContentEditableWarning
                onBlur={e => handleEdit('fullName', null, null, e.target.textContent)}>
                {resume.fullName}
            </h2>
            <div className="contact-line">{contactParts.join('  |  ')}</div>

            {/* Professional Summary */}
            {resume.professionalSummary && (
                <>
                    <div className="section-title">Professional Summary</div>
                    <p className="editable" style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#334155' }}
                       contentEditable suppressContentEditableWarning
                       onBlur={e => handleEdit('professionalSummary', null, null, e.target.textContent)}>
                        {resume.professionalSummary}
                    </p>
                </>
            )}

            {/* Skills */}
            {resume.skills && resume.skills.length > 0 && (
                <>
                    <div className="section-title">Technical Skills</div>
                    <p className="editable" style={{ fontSize: '0.82rem', color: '#334155' }}
                       contentEditable suppressContentEditableWarning
                       onBlur={e => handleEdit('skills', null, null, e.target.textContent.split(/\s*[|,]\s*/).filter(Boolean))}>
                        {resume.skills.join('  |  ')}
                    </p>
                </>
            )}

            {/* Experience */}
            {resume.experience && resume.experience.length > 0 && (
                <>
                    <div className="section-title">Professional Experience</div>
                    {resume.experience.map((exp, i) => (
                        <div key={i}>
                            <div className="exp-header">
                                <span className="role editable" contentEditable suppressContentEditableWarning
                                    onBlur={e => handleEdit('experience', i, 'role', e.target.textContent)}>
                                    {exp.role}
                                </span>
                                <span className="duration">{exp.duration}</span>
                            </div>
                            <div className="company">{exp.company}</div>
                            <ul>
                                {exp.bullets?.map((b, j) => (
                                    <li key={j} className="editable" contentEditable suppressContentEditableWarning
                                        onBlur={e => handleBulletEdit('experience', i, j, e.target.textContent)}>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </>
            )}

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
                <>
                    <div className="section-title">Projects</div>
                    {resume.projects.map((proj, i) => (
                        <div key={i}>
                            <div className="exp-header">
                                <span className="role editable" contentEditable suppressContentEditableWarning
                                    onBlur={e => handleEdit('projects', i, 'title', e.target.textContent)}>
                                    {proj.title}
                                </span>
                                <span className="duration">{proj.techStack}</span>
                            </div>
                            <ul>
                                {proj.bullets?.map((b, j) => (
                                    <li key={j} className="editable" contentEditable suppressContentEditableWarning
                                        onBlur={e => handleBulletEdit('projects', i, j, e.target.textContent)}>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </>
            )}

            {/* Education */}
            {resume.education && resume.education.length > 0 && (
                <>
                    <div className="section-title">Education</div>
                    {resume.education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '0.4rem' }}>
                            <div className="exp-header">
                                <span className="role">{edu.degree}</span>
                                <span className="duration">{edu.year}</span>
                            </div>
                            <div className="company">{edu.institution}{edu.score ? ` | ${edu.score}` : ''}</div>
                        </div>
                    ))}
                </>
            )}

            {/* Certifications & Achievements */}
            {((resume.certifications && resume.certifications.length > 0) || (resume.achievements && resume.achievements.length > 0)) && (
                <>
                    <div className="section-title">Certifications & Achievements</div>
                    <ul>
                        {resume.certifications?.map((c, i) => (
                            <li key={`cert-${i}`} className="editable" contentEditable suppressContentEditableWarning
                                onBlur={e => handleEdit('certifications', i, null, e.target.textContent)}>
                                {c}
                            </li>
                        ))}
                        {resume.achievements?.map((a, i) => (
                            <li key={`ach-${i}`} className="editable" contentEditable suppressContentEditableWarning
                                onBlur={e => handleEdit('achievements', i, null, e.target.textContent)}>
                                {a}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default ResumePreview;
