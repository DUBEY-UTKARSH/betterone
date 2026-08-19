import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Activity,
  Droplet,
  Scale,
  MessageSquareText,
  Stethoscope,
  FileText,
  TrendingUp,
  UserCheck,
  Send,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Stack from '../components/reactbits/Stack';
import CircularText from '../components/reactbits/CircularText';
import AppleStyleDock from '../components/ui/AppleStyleDock';
import './HomeScreen.css';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { user, maskText } = useAuth();
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickAskSubmit = (e) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    navigate('/chatbot', { state: { initialPrompt: quickQuery } });
  };

  // Stack Cards data for Services Hero
  const serviceCards = [
    {
      id: 1,
      content: (
        <div className="hero-stack-content">
          <div className="hero-card-badge">AI Diagnostic QA</div>
          <h3 className="font-serif hero-card-title">Instant Medical Consultation</h3>
          <p className="hero-card-desc">
            Describe symptoms or upload clinical reports to receive immediate evidence-based guidance.
          </p>
          <button
            className="btn btn-primary btn-sm hero-card-btn"
            onClick={() => navigate('/chatbot')}
          >
            Ask AI Assistant <ArrowRight size={14} />
          </button>
        </div>
      )
    },
    {
      id: 2,
      content: (
        <div className="hero-stack-content">
          <div className="hero-card-badge badge-teal">Early Screening</div>
          <h3 className="font-serif hero-card-title">Disease Risk Assessment</h3>
          <p className="hero-card-desc">
            Screen for Chronic Kidney Disease, Diabetes, Alzheimer's, and Parkinson's risk using guided algorithms.
          </p>
          <button
            className="btn btn-primary btn-sm hero-card-btn"
            onClick={() => navigate('/early-detection')}
          >
            Start Screening <ArrowRight size={14} />
          </button>
        </div>
      )
    },
    {
      id: 3,
      content: (
        <div className="hero-stack-content">
          <div className="hero-card-badge badge-rose">Emergency 108</div>
          <h3 className="font-serif hero-card-title">Rapid SOS Ambulance Dispatch</h3>
          <p className="hero-card-desc">
            One-tap 108 emergency dispatch with live GPS coordinate transmission and instant first-aid guides.
          </p>
          <button
            className="btn btn-emergency btn-sm hero-card-btn"
            onClick={() => navigate('/emergency')}
          >
            Emergency Access <ArrowRight size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="home-screen-container">
      <AppleStyleDock />
      {/* Header Greeting */}
      <section className="welcome-banner card">
        <div className="welcome-left">
          <div className="patient-status-badge">
            <span className="status-dot"></span>
            <span>Active Profile • Patient ID: <strong className="font-mono">{user.patientId}</strong></span>
          </div>
          <h1 className="welcome-title font-serif">
            Welcome back, {user.name}
          </h1>
          <p className="welcome-sub">
            Location: {maskText(user.location, 'location')} • Registered: {user.joinedDate}
          </p>
        </div>
        <div className="welcome-right">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/profile')}
          >
            <UserCheck size={16} />
            <span>Manage Profile</span>
          </button>
          <div className="welcome-circular-wrap" title="PulseCare AI - Always On">
            <CircularText
              text="PULSECARE*AI*ALWAYS*ON*"
              onHover="speedUp"
              spinDuration={30}
              className="welcome-circular-text"
            />
          </div>
        </div>
      </section>

      {/* Services Hero (Sliding Cards Feature using <Stack />) */}
      <section className="hero-stack-section">
        <div className="section-header">
          <h2 className="section-title font-serif">Featured Clinical Capabilities</h2>
          <p className="section-subtitle">Swipe or click to cycle interactive service cards</p>
        </div>
        <Stack cards={serviceCards} randomRotation={false} sendToBackOnClick={true} />
      </section>

      {/* 4-Column Vitals Strip */}
      <section className="vitals-section">
        <div className="section-header">
          <h2 className="section-title font-serif">Real-Time Vitals Telemetry</h2>
          <span className="vitals-updated font-mono">Updated 10m ago</span>
        </div>
        <div className="grid-4">
          <div className="vital-card card">
            <div className="vital-header">
              <span className="vital-name">Heart Rate</span>
              <Heart size={18} className="vital-icon text-rose" />
            </div>
            <div className="vital-value font-mono">72 <span className="vital-unit">bpm</span></div>
            <div className="vital-status status-normal">● Normal Rhythm</div>
          </div>

          <div className="vital-card card">
            <div className="vital-header">
              <span className="vital-name">Blood Pressure</span>
              <Activity size={18} className="vital-icon text-teal" />
            </div>
            <div className="vital-value font-mono">120/80 <span className="vital-unit">mmHg</span></div>
            <div className="vital-status status-normal">● Optimal Range</div>
          </div>

          <div className="vital-card card">
            <div className="vital-header">
              <span className="vital-name">Blood Glucose</span>
              <Droplet size={18} className="vital-icon text-amber" />
            </div>
            <div className="vital-value font-mono">95 <span className="vital-unit">mg/dL</span></div>
            <div className="vital-status status-normal">● Fasting Normal</div>
          </div>

          <div className="vital-card card">
            <div className="vital-header">
              <span className="vital-name">BMI Index</span>
              <Scale size={18} className="vital-icon text-teal" />
            </div>
            <div className="vital-value font-mono">22.4 <span className="vital-unit">kg/m²</span></div>
            <div className="vital-status status-normal">● Healthy Weight</div>
          </div>
        </div>
      </section>

      {/* Quick-Ask Input Bar */}
      <section className="quick-ask-section card">
        <div className="quick-ask-header">
          <Sparkles size={18} className="text-teal" />
          <h3 className="font-serif">Quick Clinical Query</h3>
        </div>
        <form onSubmit={handleQuickAskSubmit} className="quick-ask-form">
          <input
            type="text"
            className="quick-ask-input"
            placeholder="Ask PulseCare AI anything about your symptoms, medication, or test results..."
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary quick-ask-btn">
            <span>Consult AI</span>
            <Send size={16} />
          </button>
        </form>
      </section>

      {/* 2-Column Module Navigation Grid */}
      <section className="module-grid-section">
        <div className="section-header">
          <h2 className="section-title font-serif">Healthcare Modules</h2>
        </div>
        <div className="grid-2">
          {/* Module 1: AI Chatbot */}
          <div className="module-card card" onClick={() => navigate('/chatbot')}>
            <div className="module-icon-wrap icon-teal">
              <MessageSquareText size={24} />
            </div>
            <div className="module-info">
              <h3 className="module-name font-serif">Clinical AI Chatbot</h3>
              <p className="module-desc">
                24/7 symptom analysis, medication guidance, and specialist recommendation.
              </p>
            </div>
            <ArrowRight size={18} className="module-arrow" />
          </div>

          {/* Module 2: Early Detection */}
          <div className="module-card card" onClick={() => navigate('/early-detection')}>
            <div className="module-icon-wrap icon-teal">
              <Stethoscope size={24} />
            </div>
            <div className="module-info">
              <h3 className="module-name font-serif">Early Disease Screening</h3>
              <p className="module-desc">
                Interactive diagnostic wizard for CKD, Diabetes, Cancer, and Neurodegenerative risk.
              </p>
            </div>
            <ArrowRight size={18} className="module-arrow" />
          </div>

          {/* Module 3: My Health */}
          <div className="module-card card" onClick={() => navigate('/my-health')}>
            <div className="module-icon-wrap icon-blue">
              <FileText size={24} />
            </div>
            <div className="module-info">
              <h3 className="module-name font-serif">My Health Vault & Rx</h3>
              <p className="module-desc">
                Interactive medication checklists, prescription trackers, and report document storage.
              </p>
            </div>
            <ArrowRight size={18} className="module-arrow" />
          </div>

          {/* Module 4: Improve */}
          <div className="module-card card" onClick={() => navigate('/improve')}>
            <div className="module-icon-wrap icon-amber">
              <TrendingUp size={24} />
            </div>
            <div className="module-info">
              <h3 className="module-name font-serif">Habits & Prevention</h3>
              <p className="module-desc">
                Hydration counters, daily step goals, and dynamic precautionary recommendations.
              </p>
            </div>
            <ArrowRight size={18} className="module-arrow" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
