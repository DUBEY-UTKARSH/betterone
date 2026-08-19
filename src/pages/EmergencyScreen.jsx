import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle, Phone, MapPin, ChevronDown, ChevronUp,
  Heart, Siren, Clock, CheckCircle2, Navigation
} from 'lucide-react';
import './EmergencyScreen.css';

const FIRST_AID_GUIDES = [
  {
    id: 'cpr',
    title: 'CPR (Cardiopulmonary Resuscitation)',
    icon: '❤️',
    steps: [
      'Ensure the scene is safe. Tap the person and shout "Are you okay?"',
      'Call 108 (or have someone else call) immediately.',
      'Position the person on their back on a firm, flat surface.',
      'Place heel of hand on center of chest (lower half of sternum).',
      'Interlock fingers and keep arms straight. Push hard and fast: 100–120 compressions/min, 2 inches deep.',
      'After 30 compressions, give 2 rescue breaths (tilt head, lift chin, seal mouth, blow for 1 second).',
      'Continue 30:2 cycle until emergency services arrive or the person regains consciousness.'
    ]
  },
  {
    id: 'choking',
    title: 'Choking (Heimlich Maneuver)',
    icon: '🤚',
    steps: [
      'Ask "Are you choking?" If they cannot speak, cough, or breathe — act immediately.',
      'Stand behind the person with one foot forward for stability.',
      'Lean them slightly forward. Wrap your arms around their waist.',
      'Make a fist with one hand, thumb side in, placed just above the navel and below the breastbone.',
      'Grasp your fist with the other hand. Give quick upward thrusts — hard and fast.',
      'Repeat 5 abdominal thrusts alternating with 5 firm back blows between shoulder blades.',
      'Continue until the object is dislodged or the person becomes unconscious — then begin CPR.'
    ]
  },
  {
    id: 'cardiac',
    title: 'Cardiac Arrest Response',
    icon: '🫀',
    steps: [
      'Recognize signs: sudden collapse, no pulse, not breathing normally.',
      'Call 108 immediately. Activate emergency services.',
      'Begin CPR immediately: 30 chest compressions + 2 rescue breaths.',
      'Use an AED (Automated External Defibrillator) as soon as one is available — follow its voice prompts.',
      'Do not stop CPR unless: the person shows signs of life, AED takes over, or paramedics arrive.',
      'After defibrillation, continue CPR until the person breathes normally.'
    ]
  },
  {
    id: 'burns',
    title: 'Burns First Aid',
    icon: '🔥',
    steps: [
      'Remove the person from the heat source safely.',
      'Cool the burn under cool (NOT cold or icy) running water for 10–20 minutes.',
      'Do NOT use butter, toothpaste, ice, or any home remedies on the burn.',
      'Cover with a sterile, non-fluffy bandage or clean cling film loosely.',
      'Do NOT burst blisters — this increases infection risk.',
      'For severe burns: call 108, keep the person warm (prevent shock), do not remove stuck clothing.',
      'Seek emergency care for burns larger than 3 inches, face/joint burns, or chemical/electrical burns.'
    ]
  },
  {
    id: 'stroke',
    title: 'Stroke — FAST Response',
    icon: '🧠',
    steps: [
      'Use the FAST test: F = Face drooping, A = Arm weakness, S = Speech difficulty, T = Time to call 108.',
      'Note the exact time symptoms began — critical for treatment decisions.',
      'Do NOT give the person food, water, or medication.',
      'Lay them on their side (recovery position) if they are unconscious but breathing.',
      'Loosen tight clothing, especially around the neck.',
      'Keep them calm, warm, and still until paramedics arrive.',
      'Stroke treatment is most effective within the first 3–4.5 hours ("golden window").'
    ]
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding Control',
    icon: '🩸',
    steps: [
      'Wear gloves if available. Apply direct firm pressure with a clean cloth or bandage.',
      'Do NOT remove the cloth if it becomes soaked — add more layers on top.',
      'Keep continuous pressure for at least 10–15 minutes without checking.',
      'Elevate the injured limb above heart level if possible and no fracture is suspected.',
      'If an object is embedded, do NOT remove it — apply pressure around it.',
      'If bleeding does not stop, apply a tourniquet 2–3 inches above the wound (as last resort).',
      'Call 108 for severe, uncontrollable bleeding or wounds to the abdomen/chest.'
    ]
  }
];

const HOTLINES = [
  { label: 'National Ambulance', number: '108', icon: '🚑' },
  { label: 'Police Emergency', number: '100', icon: '🚔' },
  { label: 'Fire & Rescue', number: '101', icon: '🚒' },
  { label: 'Disaster Mgmt', number: '1070', icon: '⚠️' },
  { label: 'Women Helpline', number: '1091', icon: '🛡️' },
  { label: 'Child Helpline', number: '1098', icon: '👶' }
];

const EmergencyScreen = () => {
  const [dispatching, setDispatching] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [dispatched, setDispatched] = useState(false);
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [expandedGuide, setExpandedGuide] = useState(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('theme-emergency');
    return () => document.body.classList.remove('theme-emergency');
  }, []);

  const handleDispatch = () => {
    setDispatching(true);
    setCountdown(10);
    setDispatched(false);

    // Attempt GPS capture
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: pos.coords.latitude.toFixed(5),
            lng: pos.coords.longitude.toFixed(5)
          });
          setGpsError(null);
        },
        () => {
          setGpsCoords({ lat: '28.61390', lng: '77.20900' }); // Delhi fallback
          setGpsError('Approximate location (GPS permission denied)');
        }
      );
    }

    let count = 10;
    countdownRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countdownRef.current);
        setDispatching(false);
        setDispatched(true);
      }
    }, 1000);
  };

  const handleCancelDispatch = () => {
    clearInterval(countdownRef.current);
    setDispatching(false);
    setCountdown(10);
    setGpsCoords(null);
  };

  const toggleGuide = (id) => {
    setExpandedGuide((prev) => (prev === id ? null : id));
  };

  return (
    <div className="emergency-container">
      {/* Emergency Header */}
      <section className="emergency-hero card">
        <div className="emergency-hero-content">
          <div className="emergency-hero-icon">
            <Siren size={32} />
          </div>
          <div>
            <h1 className="font-serif emergency-title">Emergency Response Center</h1>
            <p className="emergency-subtitle">
              Immediate ambulance dispatch, quick-dial hotlines, and step-by-step first-aid guides.
            </p>
          </div>
        </div>
      </section>

      {/* Main Dispatch Panel + GPS */}
      <section className="dispatch-section">
        <div className="dispatch-panel card">
          {!dispatching && !dispatched ? (
            <>
              <div className="dispatch-icon-ring emergency-pulse-ring">
                <AlertTriangle size={36} />
              </div>
              <h2 className="font-serif dispatch-title">Dispatch Ambulance (108)</h2>
              <p className="dispatch-desc">
                Tap the button below to initiate emergency ambulance dispatch. Your GPS coordinates will be transmitted automatically.
              </p>
              <button
                type="button"
                className="btn btn-emergency btn-dispatch"
                onClick={handleDispatch}
              >
                <Siren size={20} /> Dispatch Ambulance — 108
              </button>
            </>
          ) : dispatching ? (
            <>
              <div className="countdown-ring">
                <Clock size={28} />
                <span className="countdown-number font-mono">{countdown}</span>
              </div>
              <h2 className="font-serif">Dispatching in {countdown} seconds…</h2>
              <p className="dispatch-desc">Ambulance location request transmitted. Stay calm.</p>
              {gpsCoords && (
                <div className="gps-display">
                  <Navigation size={14} />
                  <span className="font-mono">
                    {gpsCoords.lat}°N, {gpsCoords.lng}°E
                  </span>
                  {gpsError && <span className="gps-error">({gpsError})</span>}
                </div>
              )}
              <button
                type="button"
                className="btn btn-outline cancel-btn"
                onClick={handleCancelDispatch}
              >
                Cancel Dispatch
              </button>
            </>
          ) : (
            <>
              <div className="dispatched-icon">
                <CheckCircle2 size={48} color="#5FAE7A" />
              </div>
              <h2 className="font-serif dispatched-title">Ambulance Dispatched!</h2>
              <p className="dispatch-desc">
                Emergency services have been notified. Average ETA: 8–12 minutes. Remain calm and visible.
              </p>
              {gpsCoords && (
                <div className="gps-display">
                  <Navigation size={14} />
                  <span className="font-mono">Location transmitted: {gpsCoords.lat}°N, {gpsCoords.lng}°E</span>
                </div>
              )}
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => { setDispatched(false); setGpsCoords(null); }}
              >
                Reset
              </button>
            </>
          )}
        </div>

        {/* Quick-Dial Hotlines */}
        <div className="hotlines-panel">
          <h3 className="font-serif hotlines-title">
            <Phone size={18} className="text-rose" /> Quick-Dial Emergency Hotlines
          </h3>
          <div className="hotlines-grid">
            {HOTLINES.map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className="hotline-card"
              >
                <span className="hotline-emoji">{h.icon}</span>
                <div className="hotline-info">
                  <span className="hotline-label">{h.label}</span>
                  <span className="hotline-number font-mono">{h.number}</span>
                </div>
                <Phone size={14} className="text-muted" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* First Aid Guides */}
      <section className="first-aid-section">
        <div className="section-header">
          <h2 className="section-title font-serif">
            <Heart size={20} className="text-rose" /> Step-by-Step First-Aid Guides
          </h2>
          <span className="section-subtitle font-mono">6 critical emergency procedures</span>
        </div>
        <div className="guides-list">
          {FIRST_AID_GUIDES.map((guide) => (
            <div key={guide.id} className={`guide-item card ${expandedGuide === guide.id ? 'expanded' : ''}`}>
              <button
                type="button"
                className="guide-header-btn"
                onClick={() => toggleGuide(guide.id)}
              >
                <span className="guide-icon-emoji">{guide.icon}</span>
                <span className="font-serif guide-title">{guide.title}</span>
                {expandedGuide === guide.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedGuide === guide.id && (
                <div className="guide-steps-body">
                  {guide.steps.map((step, idx) => (
                    <div key={idx} className="guide-step">
                      <div className="step-num font-mono">{String(idx + 1).padStart(2, '0')}</div>
                      <p className="step-text">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EmergencyScreen;
