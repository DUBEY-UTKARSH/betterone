import React, { useState } from 'react';
import { Droplets, Footprints, Plus, Minus, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import './ImproveScreen.css';

const HYDRATION_GOAL = 8;
const STEPS_GOAL = 10000;

const getPrecautionaryTips = (hydrationCups, steps) => {
  const tips = [];
  const hydrationPct = (hydrationCups / HYDRATION_GOAL) * 100;
  const stepsPct = (steps / STEPS_GOAL) * 100;

  if (hydrationPct < 40) {
    tips.push({ type: 'warning', icon: '💧', text: 'Low hydration detected. Dehydration can impair kidney function, cognitive performance, and energy levels. Aim for at least 4 more glasses.' });
  } else if (hydrationPct >= 100) {
    tips.push({ type: 'success', icon: '✅', text: 'Excellent hydration! Proper water intake supports optimal kidney filtration, nutrient transport, and metabolism.' });
  } else {
    tips.push({ type: 'info', icon: '🥤', text: `Good progress — ${HYDRATION_GOAL - hydrationCups} cup(s) remaining. Consistent hydration throughout the day prevents afternoon energy dips.` });
  }

  if (stepsPct < 30) {
    tips.push({ type: 'warning', icon: '⚠️', text: 'Low activity today. Sedentary behavior increases cardiovascular risk. Even a 15-minute brisk walk improves circulation and insulin sensitivity.' });
  } else if (stepsPct >= 100) {
    tips.push({ type: 'success', icon: '🏆', text: 'Goal achieved! 10,000 steps/day significantly reduces risk of obesity, Type 2 Diabetes, and cardiovascular disease.' });
  } else {
    tips.push({ type: 'info', icon: '👟', text: `${(STEPS_GOAL - steps).toLocaleString()} steps to go. Try a short walk after your next meal — it improves post-meal glucose control.` });
  }

  // Static general tips
  tips.push({ type: 'info', icon: '🛌', text: 'Aim for 7–9 hours of quality sleep per night. Sleep debt is linked to increased cortisol, appetite dysregulation, and immune suppression.' });
  tips.push({ type: 'info', icon: '🥗', text: 'Eat a colorful plate: 50% vegetables, 25% whole grains, 25% lean protein. Minimize ultra-processed foods and hidden sodium.' });

  return tips;
};

const ImproveScreen = () => {
  const [hydrationCups, setHydrationCups] = useState(3);
  const [steps, setSteps] = useState(4250);
  const [stepsInput, setStepsInput] = useState('');

  const hydrationPct = Math.min(100, (hydrationCups / HYDRATION_GOAL) * 100);
  const stepsPct = Math.min(100, (steps / STEPS_GOAL) * 100);

  const addCup = () => setHydrationCups((prev) => Math.min(HYDRATION_GOAL, prev + 1));
  const removeCup = () => setHydrationCups((prev) => Math.max(0, prev - 1));

  const addSteps = (amount) => setSteps((prev) => Math.min(STEPS_GOAL + 5000, prev + amount));

  const handleManualSteps = () => {
    const val = parseInt(stepsInput);
    if (!isNaN(val) && val >= 0) {
      setSteps(Math.min(STEPS_GOAL + 5000, val));
      setStepsInput('');
    }
  };

  const tips = getPrecautionaryTips(hydrationCups, steps);

  return (
    <div className="improve-container">
      {/* Intro */}
      <section className="page-intro-banner card">
        <div className="intro-icon-wrap">
          <TrendingUp size={28} />
        </div>
        <div className="intro-text">
          <h1 className="font-serif intro-title">Habits & Health Improvement</h1>
          <p className="intro-sub">
            Track daily hydration, step goals, and receive dynamic precautionary health recommendations.
          </p>
        </div>
      </section>

      {/* Trackers Grid */}
      <div className="trackers-grid">
        {/* Hydration Tracker */}
        <div className="tracker-card card">
          <div className="tracker-header">
            <div className="tracker-icon-wrap">
              <Droplets size={24} />
            </div>
            <div>
              <h2 className="font-serif tracker-title">Daily Hydration</h2>
              <p className="tracker-goal-sub">Goal: {HYDRATION_GOAL} glasses per day</p>
            </div>
          </div>

          {/* Visual Water Level */}
          <div className="hydration-visual">
            <div className="water-bottle-outer">
              <div
                className="water-level"
                style={{ height: `${hydrationPct}%` }}
              />
              <div className="water-cups-label font-mono">
                {hydrationCups}/{HYDRATION_GOAL}
              </div>
            </div>
          </div>

          {/* Cup Grid */}
          <div className="cup-grid">
            {Array.from({ length: HYDRATION_GOAL }).map((_, idx) => (
              <div
                key={idx}
                className={`cup-icon ${idx < hydrationCups ? 'filled' : ''}`}
                title={`Glass ${idx + 1}`}
              >
                💧
              </div>
            ))}
          </div>

          <div className="hydration-pct-row">
            <span className="font-mono pct-number" style={{ color: hydrationPct >= 100 ? '#5FAE7A' : hydrationPct < 40 ? '#E2D36B' : '#96D7C6' }}>
              {hydrationPct.toFixed(0)}%
            </span>
            <span className="pct-label">of daily goal</span>
          </div>

          <div className="tracker-controls">
            <button className="btn btn-outline tracker-btn" onClick={removeCup} disabled={hydrationCups === 0}>
              <Minus size={16} /> Remove Cup
            </button>
            <button className="btn btn-primary tracker-btn" onClick={addCup} disabled={hydrationCups >= HYDRATION_GOAL}>
              <Plus size={16} /> Add Cup
            </button>
          </div>
        </div>

        {/* Step Tracker */}
        <div className="tracker-card card">
          <div className="tracker-header">
            <div className="tracker-icon-wrap tracker-icon-amber">
              <Footprints size={24} />
            </div>
            <div>
              <h2 className="font-serif tracker-title">Daily Step Count</h2>
              <p className="tracker-goal-sub">Goal: {STEPS_GOAL.toLocaleString()} steps per day</p>
            </div>
          </div>

          {/* Circular Progress */}
          <div className="steps-circular-wrap">
            <svg viewBox="0 0 120 120" className="steps-circle-svg">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={stepsPct >= 100 ? '#5FAE7A' : stepsPct < 30 ? '#E2D36B' : '#96D7C6'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - stepsPct / 100)}`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="steps-circle-inner">
              <span className="steps-count font-mono">{steps.toLocaleString()}</span>
              <span className="steps-unit">steps</span>
            </div>
          </div>

          <div className="steps-quick-add">
            <span className="steps-quick-label">Quick Add:</span>
            {[500, 1000, 2000, 5000].map((amt) => (
              <button
                key={amt}
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => addSteps(amt)}
              >
                +{amt.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="steps-manual-entry">
            <input
              type="number"
              className="form-input"
              placeholder="Enter exact step count"
              value={stepsInput}
              onChange={(e) => setStepsInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSteps()}
            />
            <button className="btn btn-primary" onClick={handleManualSteps}>Set</button>
          </div>

          <div className="steps-progress-text font-mono">
            {stepsPct >= 100 ? (
              <span style={{ color: '#5FAE7A' }}>🏆 Daily goal achieved!</span>
            ) : (
              <span style={{ color: '#96D7C6' }}>{(STEPS_GOAL - steps).toLocaleString()} steps remaining</span>
            )}
          </div>
        </div>
      </div>

      {/* Precautionary Tips */}
      <section className="tips-section">
        <div className="section-header">
          <h2 className="section-title font-serif">
            <AlertCircle size={20} className="text-amber" /> Precautionary Health Recommendations
          </h2>
          <span className="section-subtitle font-mono">Dynamic — based on today's metrics</span>
        </div>
        <div className="tips-list">
          {tips.map((tip, idx) => (
            <div key={idx} className={`tip-item tip-${tip.type}`}>
              <span className="tip-icon">{tip.icon}</span>
              <p className="tip-text">{tip.text}</p>
              {tip.type === 'success' && <CheckCircle2 size={18} style={{ color: '#5FAE7A', flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ImproveScreen;
