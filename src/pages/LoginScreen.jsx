import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Phone, MapPin, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Orb from '../components/reactbits/Orb';
import CircularText from '../components/reactbits/CircularText';
import './LoginScreen.css';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { login, loadDemoProfile, DEMO_USER } = useAuth();
  const { theme } = useTheme();

  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    location: '',
    dob: '',
    gender: 'Female',
    bloodGroup: 'O+'
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    }

    // Phone format check: numbers and standard formats
    const phoneRegex = /^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!phoneRegex.test(formData.contact.trim())) {
      newErrors.contact = 'Please enter a valid contact number (e.g. +1 (555) 234-5678)';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location (City, State) is required';
    }

    // DOB format check: YYYY-MM-DD
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const birthYear = new Date(formData.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      if (isNaN(birthYear) || birthYear < 1900 || birthYear > currentYear) {
        newErrors.dob = 'Please enter a valid date of birth';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      login(formData);
      navigate('/home');
    }
  };

  const handleUseDemo = () => {
    setFormData(DEMO_USER);
    loadDemoProfile();
    navigate('/home');
  };

  return (
    <div className="login-screen-container">
      <div className="login-orb-stage" aria-hidden="true">
        <Orb
          hue={105}
          hoverIntensity={0.4}
          rotateOnHover={true}
          forceHoverState={true}
          backgroundColor={theme === 'dark' ? '#121015' : '#F5F2ED'}
        />
      </div>
      <div className="login-card card">
        {/* Header Badge */}
        <div className="login-header">
          <div className="login-badge">
            <ShieldCheck size={20} className="badge-icon" />
            <span>HIPAA Compliant Patient Portal</span>
          </div>
          <h1 className="login-title font-serif">
            {isRegisterMode ? 'Create Patient Profile' : 'Sign In to PulseCare AI'}
          </h1>
          <p className="login-subtitle">
            Secure, intelligent healthcare monitoring and diagnostic screening.
          </p>
        </div>

        {/* Demo Auto-fill Quick Action */}
        <div className="demo-fill-banner">
          <div className="demo-info">
            <Sparkles size={16} className="text-teal" />
            <span>Testing the app? Instant fill with sample profile.</span>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm demo-btn"
            onClick={handleUseDemo}
          >
            Use Demo Profile
          </button>
        </div>

        {/* Auth Mode Toggle */}
        <div className="login-tabs">
          <button
            type="button"
            className={`tab-btn ${isRegisterMode ? 'active' : ''}`}
            onClick={() => setIsRegisterMode(true)}
          >
            Register Profile
          </button>
          <button
            type="button"
            className={`tab-btn ${!isRegisterMode ? 'active' : ''}`}
            onClick={() => setIsRegisterMode(false)}
          >
            Existing Sign In
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              <User size={14} /> Full Name
            </label>
            <input
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="e.g. Eleanor Vance"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Phone size={14} /> Contact Number
            </label>
            <input
              type="text"
              className={`form-input ${errors.contact ? 'error' : ''}`}
              placeholder="e.g. +1 (555) 234-5678"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
            {errors.contact && <span className="form-error">{errors.contact}</span>}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                <MapPin size={14} /> Location
              </label>
              <input
                type="text"
                className={`form-input ${errors.location ? 'error' : ''}`}
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              {errors.location && <span className="form-error">{errors.location}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} /> Date of Birth
              </label>
              <input
                type="date"
                className={`form-input ${errors.dob ? 'error' : ''}`}
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
              {errors.dob && <span className="form-error">{errors.dob}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-input"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-input"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="O+">O positive (O+)</option>
                <option value="O-">O negative (O-)</option>
                <option value="A+">A positive (A+)</option>
                <option value="A-">A negative (A-)</option>
                <option value="B+">B positive (B+)</option>
                <option value="B-">B negative (B-)</option>
                <option value="AB+">AB positive (AB+)</option>
                <option value="AB-">AB negative (AB-)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block submit-btn">
            <span>{isRegisterMode ? 'Save Profile & Continue' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {/* Floating Emergency SOS Circular Badge */}
      <div
        className="sos-circular-badge"
        onClick={() => navigate('/emergency')}
        role="button"
        tabIndex={0}
        aria-label="Emergency SOS 108"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate('/emergency');
          }
        }}
      >
        <CircularText
          text="SOS*108*EMERGENCY*"
          onHover="speedUp"
          spinDuration={12}
          className="sos-circular-text"
        />
      </div>
    </div>
  );
};

export default LoginScreen;
