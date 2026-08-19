import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, AlertTriangle, User, LogOut, Shield, Moon, Sun, MessageSquareHeart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PillNav from './reactbits/PillNav';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isPiiMasked, togglePiiMasking } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isEmergencyPage = location.pathname === '/emergency';

  const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Services', path: '/services' },
    { label: 'Ask AI', path: '/chatbot' },
    { label: 'Early Detection', path: '/early-detection' },
    { label: 'My Health', path: '/my-health' },
    { label: 'Improve', path: '/improve' }
  ];

  return (
    <header className={`navbar-header ${isEmergencyPage ? 'navbar-emergency' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/home')}>
          <div className="logo-icon-wrap">
            <Activity className="logo-icon" size={22} />
          </div>
          <div className="logo-text">
            <span className="brand-name">PulseCare</span>
            <span className="brand-ai font-serif">AI</span>
          </div>
        </div>

        {/* Pill Navigation */}
        <div className="navbar-center">
          <PillNav items={navItems} activePath={location.pathname} />
        </div>

        {/* Right Actions & Emergency SOS */}
        <div className="navbar-right">
          {/* Theme Toggle */}
          <button
            type="button"
            className="btn-icon-ghost"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Feedback Button */}
          <button
            type="button"
            className="btn-icon-ghost"
            onClick={() => navigate('/feedback')}
            title="Send Feedback"
            aria-label="Send feedback"
          >
            <MessageSquareHeart size={16} />
          </button>

          {/* Emergency SOS Button */}
          <button
            type="button"
            className="btn btn-emergency emergency-pulse-ring sos-btn"
            onClick={() => navigate('/emergency')}
            title="Immediate Emergency / Ambulance Support"
          >
            <AlertTriangle size={16} />
            <span>SOS 108</span>
          </button>

          {/* User Auth Info */}
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <button
                type="button"
                className="user-avatar-btn"
                onClick={() => navigate('/profile')}
                title="View Health Profile"
              >
                <User size={16} />
                <span className="user-name-short">{user.name.split(' ')[0]}</span>
                <span className="badge-id">{user.patientId}</span>
              </button>
              <button
                type="button"
                className="btn-icon-ghost"
                onClick={togglePiiMasking}
                title={isPiiMasked ? "PII Masked (Click to Unmask)" : "PII Visible (Click to Mask)"}
              >
                <Shield size={16} className={isPiiMasked ? "text-primary" : "text-muted"} />
              </button>
              <button
                type="button"
                className="btn-icon-ghost"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-btn-group">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/login')}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
