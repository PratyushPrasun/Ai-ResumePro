import React, { useState } from 'react';
import { Plus, X, User, Briefcase, GraduationCap, FolderOpen, Award, Star } from 'lucide-react';

const emptyExperience = { role: '', company: '', duration: '', responsibilities: '', achievements: '' };
const emptyEducation = { degree: '', institution: '', year: '', score: '' };
const emptyProject = { title: '', techStack: '', description: '', impact: '' };

const ResumeForm = ({ onSubmit, loading }) => {
    const [form, setForm] = useState({
        fullName: '', phone: '', email: '', linkedIn: '', github: '',
        skills: [],
        experience: [{ ...emptyExperience }],
        education: [{ ...emptyEducation }],
        projects: [{ ...emptyProject }],
        certifications: [''],
        achievements: ['']
    });
    const [targetJobRole, setTargetJobRole] = useState('');
    const [skillInput, setSkillInput] = useState('');

    const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

    const updateArrayItem = (field, idx, key, val) => {
        setForm(f => {
            const arr = [...f[field]];
            if (typeof arr[idx] === 'object') {
                arr[idx] = { ...arr[idx], [key]: val };
            } else {
                arr[idx] = val;
            }
            return { ...f, [field]: arr };
        });
    };

    const addItem = (field, template) => {
        setForm(f => ({ ...f, [field]: [...f[field], typeof template === 'object' ? { ...template } : ''] }));
    };

    const removeItem = (field, idx) => {
        setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!form.skills.includes(skillInput.trim())) {
                update('skills', [...form.skills, skillInput.trim()]);
            }
            setSkillInput('');
        }
    };

    const removeSkill = (idx) => {
        update('skills', form.skills.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!targetJobRole.trim()) return;
        onSubmit({ inputData: form, targetJobRole });
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Target Job Role */}
            <div className="target-role-input">
                <label>🎯 Target Job Role *</label>
                <input
                    type="text"
                    placeholder="e.g., Senior Frontend Developer, Data Scientist, DevOps Engineer..."
                    value={targetJobRole}
                    onChange={(e) => setTargetJobRole(e.target.value)}
                    required
                />
            </div>

            <div className="glass-card">
                {/* Personal Information */}
                <div className="form-section">
                    <h3><User size={18} /> Personal Information</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="John Doe" required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Email *</label>
                            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="john@example.com" required />
                        </div>
                        <div className="form-group">
                            <label>LinkedIn URL</label>
                            <input type="text" value={form.linkedIn} onChange={e => update('linkedIn', e.target.value)} placeholder="linkedin.com/in/johndoe" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>GitHub URL</label>
                            <input type="text" value={form.github} onChange={e => update('github', e.target.value)} placeholder="github.com/johndoe" />
                        </div>
                        <div className="form-group" />
                    </div>
                </div>

                {/* Skills */}
                <div className="form-section">
                    <h3><Star size={18} /> Skills</h3>
                    <div className="form-group">
                        <label>Type a skill and press Enter to add</label>
                        <div className="tags-container" onClick={() => document.getElementById('skillInput')?.focus()}>
                            {form.skills.map((s, i) => (
                                <span key={i} className="tag">
                                    {s}
                                    <button type="button" onClick={() => removeSkill(i)}>×</button>
                                </span>
                            ))}
                            <input
                                id="skillInput"
                                type="text"
                                value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={addSkill}
                                placeholder={form.skills.length === 0 ? 'e.g., React, Python, AWS...' : ''}
                            />
                        </div>
                    </div>
                </div>

                {/* Work Experience */}
                <div className="form-section">
                    <h3><Briefcase size={18} /> Work Experience</h3>
                    {form.experience.map((exp, i) => (
                        <div key={i} className="repeatable-group">
                            {form.experience.length > 1 && (
                                <button type="button" className="remove-btn" onClick={() => removeItem('experience', i)}>
                                    <X size={14} />
                                </button>
                            )}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Job Title / Role</label>
                                    <input type="text" value={exp.role} onChange={e => updateArrayItem('experience', i, 'role', e.target.value)} placeholder="Software Engineer" />
                                </div>
                                <div className="form-group">
                                    <label>Company</label>
                                    <input type="text" value={exp.company} onChange={e => updateArrayItem('experience', i, 'company', e.target.value)} placeholder="Google" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Duration</label>
                                <input type="text" value={exp.duration} onChange={e => updateArrayItem('experience', i, 'duration', e.target.value)} placeholder="Jan 2022 - Present" />
                            </div>
                            <div className="form-group">
                                <label>Key Responsibilities</label>
                                <textarea rows="2" value={exp.responsibilities} onChange={e => updateArrayItem('experience', i, 'responsibilities', e.target.value)} placeholder="Describe your main responsibilities..." />
                            </div>
                            <div className="form-group">
                                <label>Achievements / Impact</label>
                                <textarea rows="2" value={exp.achievements} onChange={e => updateArrayItem('experience', i, 'achievements', e.target.value)} placeholder="Reduced latency by 40%, led a team of 5..." />
                            </div>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addItem('experience', emptyExperience)}>
                        <Plus size={16} /> Add Experience
                    </button>
                </div>

                {/* Education */}
                <div className="form-section">
                    <h3><GraduationCap size={18} /> Education</h3>
                    {form.education.map((edu, i) => (
                        <div key={i} className="repeatable-group">
                            {form.education.length > 1 && (
                                <button type="button" className="remove-btn" onClick={() => removeItem('education', i)}>
                                    <X size={14} />
                                </button>
                            )}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Degree</label>
                                    <input type="text" value={edu.degree} onChange={e => updateArrayItem('education', i, 'degree', e.target.value)} placeholder="B.Tech in Computer Science" />
                                </div>
                                <div className="form-group">
                                    <label>Institution</label>
                                    <input type="text" value={edu.institution} onChange={e => updateArrayItem('education', i, 'institution', e.target.value)} placeholder="MIT" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Year</label>
                                    <input type="text" value={edu.year} onChange={e => updateArrayItem('education', i, 'year', e.target.value)} placeholder="2020 - 2024" />
                                </div>
                                <div className="form-group">
                                    <label>CGPA / Percentage</label>
                                    <input type="text" value={edu.score} onChange={e => updateArrayItem('education', i, 'score', e.target.value)} placeholder="8.5 CGPA" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addItem('education', emptyEducation)}>
                        <Plus size={16} /> Add Education
                    </button>
                </div>

                {/* Projects */}
                <div className="form-section">
                    <h3><FolderOpen size={18} /> Projects</h3>
                    {form.projects.map((proj, i) => (
                        <div key={i} className="repeatable-group">
                            {form.projects.length > 1 && (
                                <button type="button" className="remove-btn" onClick={() => removeItem('projects', i)}>
                                    <X size={14} />
                                </button>
                            )}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Project Title</label>
                                    <input type="text" value={proj.title} onChange={e => updateArrayItem('projects', i, 'title', e.target.value)} placeholder="E-Commerce Platform" />
                                </div>
                                <div className="form-group">
                                    <label>Tech Stack</label>
                                    <input type="text" value={proj.techStack} onChange={e => updateArrayItem('projects', i, 'techStack', e.target.value)} placeholder="React, Node.js, MongoDB" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea rows="2" value={proj.description} onChange={e => updateArrayItem('projects', i, 'description', e.target.value)} placeholder="Built a scalable e-commerce platform with..." />
                            </div>
                            <div className="form-group">
                                <label>Impact / Metrics</label>
                                <input type="text" value={proj.impact} onChange={e => updateArrayItem('projects', i, 'impact', e.target.value)} placeholder="Served 10K+ users, 99.9% uptime" />
                            </div>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addItem('projects', emptyProject)}>
                        <Plus size={16} /> Add Project
                    </button>
                </div>

                {/* Certifications */}
                <div className="form-section">
                    <h3><Award size={18} /> Certifications</h3>
                    {form.certifications.map((cert, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                <input type="text" value={cert} onChange={e => updateArrayItem('certifications', i, null, e.target.value)} placeholder="AWS Certified Solutions Architect" />
                            </div>
                            {form.certifications.length > 1 && (
                                <button type="button" className="remove-btn" style={{ position: 'static', width: 32, height: 32 }} onClick={() => removeItem('certifications', i)}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addItem('certifications', '')}>
                        <Plus size={16} /> Add Certification
                    </button>
                </div>

                {/* Achievements */}
                <div className="form-section">
                    <h3><Award size={18} /> Achievements</h3>
                    {form.achievements.map((ach, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                <input type="text" value={ach} onChange={e => updateArrayItem('achievements', i, null, e.target.value)} placeholder="Winner of XYZ Hackathon 2023" />
                            </div>
                            {form.achievements.length > 1 && (
                                <button type="button" className="remove-btn" style={{ position: 'static', width: 32, height: 32 }} onClick={() => removeItem('achievements', i)}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addItem('achievements', '')}>
                        <Plus size={16} /> Add Achievement
                    </button>
                </div>

                {/* Submit */}
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ fontSize: '1.1rem', padding: '0.9rem 2.5rem' }}>
                        {loading ? 'Generating...' : '✨ Generate Optimized Resume'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ResumeForm;
