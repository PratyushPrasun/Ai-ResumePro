import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Target, Sparkles, FileText, Download,
    Upload, BarChart3, Zap, Shield, Users, Award,
    ArrowRight, Star, ChevronRight, CheckCircle
} from 'lucide-react';
import './LandingPage.css';
import { AuthContext } from '../context/AuthContext';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

const stagger = {
    visible: { transition: { staggerChildren: 0.12 } }
};

const features = [
    {
        icon: <Target size={28} />,
        title: 'ATS Score Analysis',
        desc: 'Get an instant compatibility score showing how well your resume matches applicant tracking systems.',
        color: 'var(--primary)'
    },
    {
        icon: <Sparkles size={28} />,
        title: 'AI Resume Rewriting',
        desc: 'Let AI optimize your resume content with industry-specific keywords and impactful bullet points.',
        color: 'var(--accent)'
    },
    {
        icon: <BarChart3 size={28} />,
        title: 'Job-Based Optimization',
        desc: 'Tailor your resume for specific roles with targeted keyword matching and gap analysis.',
        color: 'var(--success)'
    },
    {
        icon: <Download size={28} />,
        title: 'PDF Download',
        desc: 'Download your polished, ATS-optimized resume as a clean, professional PDF instantly.',
        color: 'var(--warning)'
    }
];

const steps = [
    {
        num: '01',
        icon: <Upload size={32} />,
        title: 'Upload or Build',
        desc: 'Upload your existing resume or build one from scratch using our guided form.'
    },
    {
        num: '02',
        icon: <Zap size={32} />,
        title: 'AI Optimization',
        desc: 'Our AI analyzes your resume against your target role and ATS requirements.'
    },
    {
        num: '03',
        icon: <FileText size={32} />,
        title: 'Download & Apply',
        desc: 'Download your optimized resume and start applying with confidence.'
    }
];

const whyUs = [
    { icon: <Shield size={22} />, title: 'Privacy First', desc: 'Your data is never stored or shared.' },
    { icon: <Zap size={22} />, title: 'Instant Results', desc: 'Get analysis in under 30 seconds.' },
    { icon: <Award size={22} />, title: 'ATS-Optimized', desc: 'Beat 95% of applicant tracking systems.' },
    { icon: <Users size={22} />, title: 'For Everyone', desc: 'Students, professionals, career changers.' }
];

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Software Engineer at Google',
        text: 'AI ResumePro helped me land my dream job. The ATS scoring showed me exactly what I was missing.',
        rating: 5
    },
    {
        name: 'James Rodriguez',
        role: 'Data Scientist',
        text: 'The AI-optimized resume I generated was significantly better than what I had. Got 3x more callbacks.',
        rating: 5
    },
    {
        name: 'Priya Patel',
        role: 'Product Manager at Microsoft',
        text: 'Clean, professional results every time. This tool is a must-have for any serious job seeker.',
        rating: 5
    }
];

const LandingPage = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <div className="landing">

            {/* ─── HERO ─── */}
            <section className="hero">
                <div className="hero-bg-blob hero-bg-blob--1" />
                <div className="hero-bg-blob hero-bg-blob--2" />
                <div className="hero-bg-blob hero-bg-blob--3" />

                <motion.div
                    className="hero-content"
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                >
                    <motion.div variants={fadeUp} className="hero-badge">
                        <Sparkles size={14} />
                        Powered by AI — Free to use
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="hero-title">
                        Build Resumes That
                        <span className="hero-gradient"> Beat the ATS</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="hero-subtitle">
                        AI-powered resume analyzer and generator that helps you create
                        ATS-optimized resumes tailored to your dream job — in minutes.
                    </motion.p>

                    <motion.div variants={fadeUp} className="hero-actions">
                        <Link to={user ? '/dashboard' : '/register'} className="btn-hero btn-hero--primary">
                            Get Started Free <ArrowRight size={18} />
                        </Link>
                        <Link to={user ? '/dashboard' : '/login'} className="btn-hero btn-hero--secondary">
                            Upload Resume <Upload size={18} />
                        </Link>
                    </motion.div>

                    <motion.div variants={fadeUp} className="hero-stats">
                        <div className="hero-stat">
                            <strong>10K+</strong>
                            <span>Resumes Optimized</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <strong>95%</strong>
                            <span>ATS Pass Rate</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <strong>3x</strong>
                            <span>More Interviews</span>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── FEATURES ─── */}
            <section className="section features-section" id="features">
                <motion.div
                    className="section-container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={stagger}
                >
                    <motion.div variants={fadeUp} className="section-header">
                        <span className="section-label">Features</span>
                        <h2>Everything You Need to Land the Job</h2>
                        <p>Powerful AI tools designed to give your resume the competitive edge.</p>
                    </motion.div>

                    <div className="features-grid">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                className="feature-card"
                                variants={fadeUp}
                                custom={i}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            >
                                <div className="feature-icon" style={{ color: f.color, background: `${f.color}15` }}>
                                    {f.icon}
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section className="section how-section">
                <motion.div
                    className="section-container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={stagger}
                >
                    <motion.div variants={fadeUp} className="section-header">
                        <span className="section-label">How It Works</span>
                        <h2>Three Simple Steps</h2>
                        <p>From upload to optimized resume in under 2 minutes.</p>
                    </motion.div>

                    <div className="steps-grid">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                className="step-card"
                                variants={fadeUp}
                                custom={i}
                            >
                                <div className="step-num">{step.num}</div>
                                <div className="step-icon">{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                                {i < steps.length - 1 && <div className="step-connector"><ChevronRight size={24} /></div>}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ─── WHY CHOOSE US ─── */}
            <section className="section why-section">
                <motion.div
                    className="section-container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={stagger}
                >
                    <motion.div variants={fadeUp} className="section-header">
                        <span className="section-label">Why Choose Us</span>
                        <h2>Built for Job Seekers, by Engineers</h2>
                    </motion.div>

                    <div className="why-grid">
                        {whyUs.map((item, i) => (
                            <motion.div key={i} className="why-card" variants={fadeUp} custom={i}>
                                <div className="why-icon">{item.icon}</div>
                                <div>
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ─── TESTIMONIALS ─── */}
            <section className="section testimonials-section">
                <motion.div
                    className="section-container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={stagger}
                >
                    <motion.div variants={fadeUp} className="section-header">
                        <span className="section-label">Testimonials</span>
                        <h2>Loved by Job Seekers Worldwide</h2>
                    </motion.div>

                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                className="testimonial-card"
                                variants={fadeUp}
                                custom={i}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            >
                                <div className="testimonial-stars">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <Star key={j} size={14} fill="var(--warning)" color="var(--warning)" />
                                    ))}
                                </div>
                                <p>"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <strong>{t.name}</strong>
                                        <span>{t.role}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ─── CTA ─── */}
            <section className="section cta-section">
                <motion.div
                    className="cta-card"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <h2>Ready to Land Your Dream Job?</h2>
                    <p>Join thousands of professionals who've transformed their resumes with AI.</p>
                    <Link to="/register" className="btn-hero btn-hero--primary">
                        Get Started Free <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="nav-logo">AI ResumePro</span>
                        <p>AI-powered resume optimization for modern job seekers.</p>
                    </div>
                    <div className="footer-links">
                        <div>
                            <h5>Product</h5>
                            <Link to="/register">Resume Analyzer</Link>
                            <Link to="/register">Resume Builder</Link>
                            <Link to="/register">ATS Checker</Link>
                        </div>
                        <div>
                            <h5>Company</h5>
                            <a href="#features">Features</a>
                            <a href="#">About Us</a>
                            <a href="#">Privacy</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 AI ResumePro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
