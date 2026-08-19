import React, { useState } from 'react';
import {
  User, Phone, MapPin, Calendar, Droplet, Shield, ShieldOff,
  Edit3, Save, X, Activity, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const { user, isPiiMasked, togglePiiMasking, maskText, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...user });

  const handleSave = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...user });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // Stats for card strip
  const healthStats = [
    { label: 'Heart Rate', value: '72 bpm', icon: <Activity size={16} />, color: '#E11D48' },
    { label: 'Blood Pressure', value: '120/80', icon: <Activity size={16} />, color: '#96D7C6' },
    { label: 'Blood Glucose', value: '95 mg/dL', icon: <Droplet size={16} />, color: '#E2D36B' },
    { label: 'BMI', value: '22.4 kg/m²', icon: <Activity size={16} />, color: '#6C8CBF' }
  ];

  return (
    <div className="profile-container">
      {/* Profile Hero Card */}
      <section className="profile-hero card">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <span className="profile-avatar-initials font-serif">
              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="profile-identity">
            <h1 className="font-serif profile-name">{user.name}</h1>
            <div className="profile-id-badge font-mono">
              <Activity size={12} />
              <span>Patient ID: {user.patientId}</span>
            </div>
            <div className="profile-joined">Member since {user.joinedDate}</div>
          </div>
        </div>

        <div className="profile-hero-actions">
          {/* PII Masking Toggle */}
          <button
            type="button"
            className={`btn pii-toggle-btn ${isPiiMasked ? 'masked' : 'unmasked'}`}
            onClick={togglePiiMasking}
            title={isPiiMasked ? 'PII is masked — click to reveal' : 'PII is visible — click to mask'}
          >
            {isPiiMasked ? <Shield size={16} /> : <ShieldOff size={16} />}
            <span>{isPiiMasked ? 'PII Masked' : 'PII Visible'}</span>
          </button>

          {!isEditing ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          ) : (
            <div className="edit-action-group">
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                <Save size={16} /> Save
              </button>
              <button type="button" className="btn btn-outline" onClick={handleCancel}>
                <X size={16} /> Cancel
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Health Stats Strip */}
      <section className="profile-stats-strip">
        {healthStats.map((stat, idx) => (
          <div key={idx} className="profile-stat-item card">
            <div className="stat-icon" style={{ color: stat.color, background: `${stat.color}18` }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value font-mono">{stat.value}</div>
            </div>
          </div>
        ))}
      </section>

      <div className="profile-grid">
        {/* Personal Information */}
        <section className="profile-section card">
          <h2 className="font-serif profile-section-title">
            <User size={18} className="text-teal" /> Personal Information
          </h2>

          <div className="profile-fields">
            {/* Full Name */}
            <div className="profile-field">
              <div className="field-icon"><User size={14} /></div>
              <div className="field-content">
                <span className="field-label">Full Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input field-input"
                    value={editData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                ) : (
                  <span className="field-value">{user.name}</span>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="profile-field">
              <div className="field-icon"><Phone size={14} /></div>
              <div className="field-content">
                <span className="field-label">Contact Number</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input field-input"
                    value={editData.contact}
                    onChange={(e) => handleChange('contact', e.target.value)}
                  />
                ) : (
                  <span className={`field-value ${isPiiMasked ? 'pii-hidden' : ''}`}>
                    {maskText(user.contact, 'phone')}
                  </span>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="profile-field">
              <div className="field-icon"><MapPin size={14} /></div>
              <div className="field-content">
                <span className="field-label">Location</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input field-input"
                    value={editData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                ) : (
                  <span className={`field-value ${isPiiMasked ? 'pii-hidden' : ''}`}>
                    {maskText(user.location, 'location')}
                  </span>
                )}
              </div>
            </div>

            {/* DOB */}
            <div className="profile-field">
              <div className="field-icon"><Calendar size={14} /></div>
              <div className="field-content">
                <span className="field-label">Date of Birth</span>
                {isEditing ? (
                  <input
                    type="date"
                    className="form-input field-input"
                    value={editData.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                  />
                ) : (
                  <span className={`field-value ${isPiiMasked ? 'pii-hidden' : ''}`}>
                    {maskText(user.dob, 'dob')}
                  </span>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="profile-field">
              <div className="field-icon"><User size={14} /></div>
              <div className="field-content">
                <span className="field-label">Gender</span>
                {isEditing ? (
                  <select
                    className="form-input field-input"
                    value={editData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                ) : (
                  <span className="field-value">{user.gender}</span>
                )}
              </div>
            </div>

            {/* Blood Group */}
            <div className="profile-field">
              <div className="field-icon"><Droplet size={14} /></div>
              <div className="field-content">
                <span className="field-label">Blood Group</span>
                {isEditing ? (
                  <select
                    className="form-input field-input"
                    value={editData.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg}>{bg}</option>
                    ))}
                  </select>
                ) : (
                  <span className="field-value blood-group-badge">{user.bloodGroup}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Clinical Summary & Quick Links */}
        <div className="profile-sidebar">
          <section className="profile-section card">
            <h2 className="font-serif profile-section-title">
              <Activity size={18} className="text-teal" /> Clinical Summary
            </h2>
            <div className="clinical-summary-items">
              {[
                { label: 'Last Screening', value: 'Diabetes — Low Risk', status: 'success' },
                { label: 'Active Medications', value: '5 prescribed', status: 'info' },
                { label: 'Upcoming Lab Work', value: 'HbA1c — Scheduled Apr 2026', status: 'warning' },
                { label: 'Primary Care Physician', value: 'Dr. Aryan Sharma, MD', status: 'info' }
              ].map((item, idx) => (
                <div key={idx} className="summary-row">
                  <div className="summary-label">{item.label}</div>
                  <div className={`summary-value status-${item.status}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section card quick-links-section">
            <h2 className="font-serif profile-section-title">Quick Links</h2>
            {[
              { label: 'View Medications', path: '/my-health' },
              { label: 'Run Disease Screening', path: '/early-detection' },
              { label: 'Consult AI Chatbot', path: '/chatbot' },
              { label: 'Emergency SOS 108', path: '/emergency', emergency: true }
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.path}
                className={`quick-link-item ${link.emergency ? 'emergency-link' : ''}`}
              >
                <span>{link.label}</span>
                <ChevronRight size={14} />
              </a>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
