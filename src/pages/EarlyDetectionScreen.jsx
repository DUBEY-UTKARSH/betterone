import React, { useState } from 'react';
import {
  Stethoscope, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  Download, RotateCcw, Activity, Brain, Droplet, Dna, Heart
} from 'lucide-react';
import PixelCard from '../components/reactbits/PixelCard';
import './EarlyDetectionScreen.css';

const DISEASES = [
  {
    id: 'ckd',
    name: 'Chronic Kidney Disease',
    abbr: 'CKD',
    icon: <Activity size={28} />,
    color: '#96D7C6',
    description: 'Assess renal filtration risk based on lifestyle, blood pressure, and lab markers.',
    questions: [
      { q: 'Do you have persistent high blood pressure (above 140/90)?', options: ['Never', 'Occasionally', 'Often', 'Always'] },
      { q: 'Do you experience puffy ankles or facial swelling?', options: ['No', 'Rarely', 'Sometimes', 'Frequently'] },
      { q: 'How often do you urinate at night (nocturia)?', options: ['Never', '1–2 times', '3–4 times', '5+ times'] },
      { q: 'Do you have diabetes or a family history of kidney disease?', options: ['Neither', 'Family history only', 'Diabetes only', 'Both'] },
      { q: 'How would you rate your overall urine clarity?', options: ['Clear/Yellow', 'Slightly cloudy', 'Cloudy', 'Dark or foamy'] }
    ]
  },
  {
    id: 'cancer',
    name: 'Cancer Risk Screen',
    abbr: 'CA',
    icon: <Dna size={28} />,
    color: '#7EC4B1',
    description: 'Evaluate general cancer risk factors including genetics, lifestyle, and environmental exposures.',
    questions: [
      { q: 'Do you currently smoke or have smoked for more than 5 years?', options: ['Never smoked', 'Quit > 10 yrs ago', 'Quit < 10 yrs ago', 'Currently smoke'] },
      { q: 'How often do you consume processed or red meats per week?', options: ['Rarely/Never', '1–2 servings', '3–4 servings', '5+ servings'] },
      { q: 'Do you have first-degree relatives with any cancer diagnosis?', options: ['None', 'One distant relative', 'One parent/sibling', 'Multiple relatives'] },
      { q: 'How frequently do you have occupational or UV radiation exposure?', options: ['Minimal', 'Occasional', 'Regular', 'Constant'] },
      { q: 'How often do you consume alcoholic beverages per week?', options: ['None', '1–2 drinks', '3–7 drinks', '8+ drinks'] }
    ]
  },
  {
    id: 'diabetes',
    name: 'Diabetes Risk',
    abbr: 'DM',
    icon: <Droplet size={28} />,
    color: '#E2D36B',
    description: 'Screen for Type 2 Diabetes risk using metabolic, genetic, and lifestyle indicators.',
    questions: [
      { q: 'What is your fasting blood glucose level range?', options: ['Below 100 mg/dL', '100–125 mg/dL', '126–200 mg/dL', 'Above 200 mg/dL'] },
      { q: 'Do you have a family history of Type 2 Diabetes?', options: ['No history', 'Extended family', 'One parent', 'Both parents'] },
      { q: 'How frequently do you engage in physical activity (30+ min)?', options: ['Daily', '3–5x/week', '1–2x/week', 'Rarely/Never'] },
      { q: 'How would you classify your BMI?', options: ['18.5–24.9 (Normal)', '25–29.9 (Overweight)', '30–34.9 (Obese)', '35+ (Severely Obese)'] },
      { q: 'Do you experience excessive thirst or frequent urination?', options: ['Never', 'Occasionally', 'Often', 'Daily'] }
    ]
  },
  {
    id: 'alzheimers',
    name: "Alzheimer's Risk",
    abbr: 'AD',
    icon: <Brain size={28} />,
    color: '#BAA7A7',
    description: "Identify early cognitive and behavioral risk indicators for Alzheimer's disease.",
    questions: [
      { q: 'Do you experience increasing difficulty remembering recent events?', options: ['No issues', 'Mild forgetfulness', 'Moderate difficulty', 'Significant impairment'] },
      { q: 'Do you have difficulty finding words during conversation?', options: ['Rarely/Never', 'Occasionally', 'Often', 'Very frequently'] },
      { q: 'Does your family have a history of Alzheimer\'s or dementia?', options: ['No history', 'Extended family', 'One parent/sibling', 'Multiple relatives'] },
      { q: 'How often do you get 7–9 hours of quality sleep per night?', options: ['Almost always', '4–5 nights/week', '2–3 nights/week', 'Rarely'] },
      { q: 'Do you experience mood changes, confusion in familiar places, or poor judgment?', options: ['Never', 'Rarely', 'Sometimes', 'Frequently'] }
    ]
  },
  {
    id: 'parkinsons',
    name: "Parkinson's Risk",
    abbr: 'PD',
    icon: <Heart size={28} />,
    color: '#6C8CBF',
    description: "Screen early motor and non-motor indicators associated with Parkinson's disease.",
    questions: [
      { q: 'Have you noticed subtle hand or limb tremors at rest?', options: ['Never', 'Rarely', 'Occasionally', 'Frequently'] },
      { q: 'Do you experience stiffness or rigidity in your muscles especially in the morning?', options: ['Never', 'Occasionally', 'Most mornings', 'Constantly'] },
      { q: 'Has your handwriting become noticeably smaller (micrographia)?', options: ['No change', 'Slight change', 'Moderate change', 'Significant change'] },
      { q: 'Do you experience a reduced sense of smell (hyposmia)?', options: ['Normal smell', 'Slightly reduced', 'Significantly reduced', 'Absent'] },
      { q: 'Do you have a family member diagnosed with Parkinson\'s disease?', options: ['No', 'Distant relative', 'Extended family member', 'Parent or sibling'] }
    ]
  }
];

const getRiskLevel = (score) => {
  if (score <= 4) return { level: 'Low', color: '#5FAE7A', levelClass: 'result-level-low', pct: 20 };
  if (score <= 9) return { level: 'Moderate', color: '#E2D36B', levelClass: 'result-level-moderate', pct: 55 };
  return { level: 'High', color: '#E11D48', levelClass: 'result-level-high', pct: 88 };
};

const EarlyDetectionScreen = () => {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleSelectDisease = (disease) => {
    setSelectedDisease(disease);
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const handleAnswer = (qIndex, ansIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: ansIndex }));
  };

  const handleNext = () => {
    if (step < selectedDisease.questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Calculate score
      const total = Object.values(answers).reduce((sum, v) => sum + v, 0);
      setResult(getRiskLevel(total));
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleReset = () => {
    setSelectedDisease(null);
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const currentQuestion = selectedDisease?.questions[step];
  const totalQuestions = selectedDisease?.questions.length || 0;
  const progressPct = selectedDisease ? ((step + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="early-detection-container">
      {/* Intro Banner */}
      <section className="page-intro-banner card">
        <div className="intro-icon-wrap">
          <Stethoscope size={28} />
        </div>
        <div className="intro-text">
          <h1 className="font-serif intro-title">Early Disease Detection Screening</h1>
          <p className="intro-sub">
            AI-guided multi-step diagnostic assessment for 5 major conditions. Select a screening module to begin.
          </p>
        </div>
      </section>

      {!selectedDisease ? (
        /* Disease Module Grid */
        <section className="disease-grid">
          <div className="section-header">
            <h2 className="section-title font-serif">Select a Screening Module</h2>
            <span className="section-subtitle font-mono">5 clinical assessment wizards available</span>
          </div>
          <div className="ed-grid">
            {DISEASES.map((disease) => (
              <PixelCard
                key={disease.id}
                className="disease-pixel-card"
                customColors={`${disease.color},#D8D3CC,#F0EDE8`}
                onClick={() => handleSelectDisease(disease)}
              >
                <div className="disease-card-inner">
                  <div className="disease-card-icon" style={{ color: disease.color, background: `${disease.color}18` }}>
                    {disease.icon}
                  </div>
                  <div className="disease-abbr font-mono" style={{ color: disease.color }}>{disease.abbr}</div>
                  <h3 className="font-serif disease-card-name">{disease.name}</h3>
                  <p className="disease-card-desc">{disease.description}</p>
                  <div className="disease-card-cta">Start Assessment →</div>
                </div>
              </PixelCard>
            ))}
          </div>
        </section>
      ) : result ? (
        /* Result Screen */
        <section className="result-section">
          <div className="result-card card" style={{ borderTop: `4px solid ${result.color}` }}>
            <div className="result-header">
              <div className="result-disease-badge">
                <span style={{ color: selectedDisease.color }}>{selectedDisease.icon}</span>
                <span className="font-serif">{selectedDisease.name} — Screening Result</span>
              </div>
            </div>

            <div className={`result-level-display ${result.levelClass}`}>
              <div className="result-icon">
                {result.level === 'Low' ? <CheckCircle2 size={36} color={result.color} /> : <AlertTriangle size={36} color={result.color} />}
              </div>
              <div className="result-text">
                <div className="result-label font-mono" style={{ color: result.color }}>RISK LEVEL</div>
                <div className="result-value font-serif" style={{ color: result.color }}>{result.level} Risk</div>
              </div>
            </div>

            {/* Horizontal Risk Meter */}
            <div className="risk-meter-section">
              <div className="risk-meter-label font-mono">Risk Index</div>
              <div className="risk-meter-bar">
                <div className="risk-meter-fill" style={{ width: `${result.pct}%`, background: result.color }} />
              </div>
              <div className="risk-meter-ticks">
                <span style={{ color: '#5FAE7A' }}>Low</span>
                <span style={{ color: '#E2D36B' }}>Moderate</span>
                <span style={{ color: '#E11D48' }}>High</span>
              </div>
            </div>

            <div className="result-advice card">
              <h4 className="font-serif">Clinical Recommendations</h4>
              {result.level === 'Low' && (
                <ul>
                  <li>Maintain current healthy lifestyle habits including regular physical activity.</li>
                  <li>Schedule annual preventive health screenings with your primary care provider.</li>
                  <li>Continue balanced nutrition and adequate hydration (8+ cups/day).</li>
                </ul>
              )}
              {result.level === 'Moderate' && (
                <ul>
                  <li>Consult your healthcare provider within 4–6 weeks for a comprehensive evaluation.</li>
                  <li>Request relevant lab tests (eGFR, HbA1c, lipid panel) depending on the condition.</li>
                  <li>Adopt targeted lifestyle modifications: reduce sodium, increase physical activity, manage weight.</li>
                </ul>
              )}
              {result.level === 'High' && (
                <ul>
                  <li><strong>Seek medical consultation promptly</strong> — within 1–2 weeks is strongly advised.</li>
                  <li>Undergo comprehensive diagnostic workup as recommended by a specialist.</li>
                  <li>Do not discontinue any existing medications without medical supervision.</li>
                </ul>
              )}
            </div>

            <div className="result-actions">
              <button className="btn btn-outline" onClick={handleReset}>
                <RotateCcw size={16} /> New Screening
              </button>
              <button className="btn btn-primary" onClick={handlePrintReport}>
                <Download size={16} /> Export Report (Print)
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* Assessment Wizard */
        <section className="wizard-section">
          <div className="wizard-header card">
            <button className="btn btn-ghost btn-sm" onClick={handleReset}>
              ← Back to Modules
            </button>
            <div className="wizard-title-row">
              <span style={{ color: selectedDisease.color }}>{selectedDisease.icon}</span>
              <h2 className="font-serif wizard-disease-title">{selectedDisease.name}</h2>
            </div>
            <div className="wizard-progress">
              <span className="font-mono progress-label">Question {step + 1} of {totalQuestions}</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>

          <div className="question-card card">
            <div className="question-number font-mono">Q{step + 1}</div>
            <h3 className="font-serif question-text">{currentQuestion.q}</h3>
            <div className="answer-options">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`answer-option ${answers[step] === idx ? 'selected' : ''}`}
                  onClick={() => handleAnswer(step, idx)}
                >
                  <span className="option-indicator">{answers[step] === idx ? '●' : '○'}</span>
                  <span>{opt}</span>
                  {idx === 0 && <span className="risk-tag risk-none">No Risk</span>}
                  {idx === 1 && <span className="risk-tag risk-low">Low</span>}
                  {idx === 2 && <span className="risk-tag risk-mod">Moderate</span>}
                  {idx === 3 && <span className="risk-tag risk-high">Higher</span>}
                </button>
              ))}
            </div>

            <div className="wizard-nav-btns">
              <button
                className="btn btn-outline"
                onClick={handleBack}
                disabled={step === 0}
              >
                <ChevronUp size={16} /> Previous
              </button>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={answers[step] === undefined}
              >
                {step === totalQuestions - 1 ? 'View Result' : 'Next Question'}
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default EarlyDetectionScreen;
