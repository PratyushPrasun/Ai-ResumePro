import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, FileSearch, Sparkles, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) =>
        `nav-link ${isActive(path) ? 'nav-link--active' : ''}`;

    const closeMobile = () => {
        setMobileOpen(false);
    };

    const drawerRef = React.useRef(null);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileOpen && drawerRef.current && !drawerRef.current.contains(event.target)) {
                // Check if the click was on the hamburger button or its children
                const isHamburger = event.target.closest('.hamburger-btn');
                if (!isHamburger) {
                    closeMobile();
                }
            }
        };

        if (mobileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mobileOpen]);

    // Close on escape key
    React.useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') closeMobile();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Prevent scroll when mobile menu is open
    React.useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileOpen]);

    return (
        <nav className="nav-bar">
            <Link to="/" className="nav-logo" onClick={closeMobile}>
                AI ResumePro
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-desktop">
                {user ? (
                    <>
                        <Link to="/dashboard" className={navLinkClass('/dashboard')} >
                            <FileSearch size={16} /> Analyzer
                        </Link>
                        <Link to="/generator" className={navLinkClass('/generator')} >
                            <Sparkles size={16} /> Resume Builder
                        </Link>
                        <span className="nav-user-name">{user.name}</span>
                        <button onClick={handleLogout} className="nav-logout-btn">
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="btn-primary nav-cta-btn">Get Started</Link>
                    </>
                )}
                <button
                    onClick={toggleTheme}
                    className="theme-toggle-btn"
                    aria-label="Toggle theme"
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    <AnimatePresence mode="wait">
                        {theme === 'dark' ? (
                            <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <Sun size={18} />
                            </motion.div>
                        ) : (
                            <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <Moon size={18} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="nav-mobile-actions">
                <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button className="hamburger-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            className="mobile-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobile}
                        />
                        <motion.div
                            ref={drawerRef}
                            className="mobile-drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <div className="mobile-drawer-content">
                                {user ? (
                                    <>
                                        <div className="mobile-user-info">
                                            <div className="mobile-user-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
                                            <span>{user.name}</span>
                                        </div>
                                        <Link to="/dashboard" className={navLinkClass('/dashboard')} onClick={closeMobile}>
                                            <FileSearch size={18} /> Analyzer
                                        </Link>
                                        <Link to="/generator" className={navLinkClass('/generator')} onClick={closeMobile}>
                                            <Sparkles size={18} /> Resume Builder
                                        </Link>
                                        <button 
                                            onClick={() => { handleLogout(); closeMobile(); }} 
                                            className="nav-logout-btn mobile-logout"
                                        >
                                            <LogOut size={18} /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="nav-link" onClick={closeMobile}>Login</Link>
                                        <Link to="/register" className="btn-primary" onClick={closeMobile} style={{ textAlign: 'center' }}>Get Started</Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
