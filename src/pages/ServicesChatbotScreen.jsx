import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MessageSquareText,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  AlertCircle,
  Sparkles,
  Bot,
  User,
  Stethoscope,
  ShieldAlert,
  FileSpreadsheet,
  Zap,
  CheckCircle2
} from 'lucide-react';
import ScrollStack, { ScrollStackItem } from '../components/reactbits/ScrollStack';
import { useAuth } from '../context/AuthContext';
import './ServicesChatbotScreen.css';

const ServicesChatbotScreen = () => {
  const location = useLocation();
  const { user } = useAuth();
  const chatBottomRef = useRef(null);

  // Initial prompt passed from homepage quick-ask bar if any
  const initialQuery = location.state?.initialPrompt || '';

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${user.name.split(' ')[0]}, I am your PulseCare AI Clinical Assistant. How can I assist you with your health today? You can describe any symptoms, ask about prescriptions, or seek specialist guidance.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState(initialQuery);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  // If initial query exists, send it automatically
  useEffect(() => {
    if (initialQuery && messages.length === 1) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick Topic Chips
  const topicChips = [
    { label: '🤒 Symptoms Check', prompt: 'I have a fever of 100.4°F with mild headache. What precautions should I take?' },
    { label: '🥗 Clinical Diet Advice', prompt: 'Can you recommend a heart-healthy diet plan for managing blood pressure?' },
    { label: '🩺 Find a Specialist', prompt: 'What type of doctor should I see for persistent joint stiffness in the morning?' },
    { label: '📑 Lab Results Help', prompt: 'My fasting blood glucose is 95 mg/dL. Is this considered normal?' },
    { label: '💊 Medication Side-Effects', prompt: 'What are the common side effects of taking Amoxicillin 500mg?' }
  ];

  // Speech Recognition Setup (Web Speech API)
  const handleMicToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please use keyboard text entry.');
      return;
    }

    if (isListening) {
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  // Text-To-Speech Read Aloud Setup (Web Speech API)
  const handleReadAloud = (msgId, text) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (speakingMsgId === msgId && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingMsgId(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeakingMsgId(null);
      };

      setSpeakingMsgId(msgId);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Generate intelligent AI clinical response
    setTimeout(() => {
      let responseText = `Thank you for sharing your inquiry regarding "${query}". Based on clinical reference guidelines, monitor your symptoms closely. Ensure adequate hydration, rest, and consult a board-certified physician if symptoms persist beyond 48 hours or worsen.`;

      if (query.toLowerCase().includes('fever') || query.toLowerCase().includes('symptom')) {
        responseText = `A fever of 100.4°F is a mild elevation indicating an immune response. Recommendations: 1. Maintain hydration with water & electrolytes. 2. Monitor temperature every 4 hours. 3. Seek immediate care if accompanied by severe neck stiffness, breathing difficulty, or confusion.`;
      } else if (query.toLowerCase().includes('diet') || query.toLowerCase().includes('pressure')) {
        responseText = `For optimal blood pressure management, adopt the DASH diet framework: 1. Limit sodium intake below 2,000 mg/day. 2. Increase potassium-rich foods (leafy greens, bananas). 3. Prioritize whole grains and lean proteins.`;
      } else if (query.toLowerCase().includes('glucose') || query.toLowerCase().includes('lab')) {
        responseText = `A fasting glucose of 95 mg/dL is within the normal healthy reference range (70–99 mg/dL). Maintain balanced nutrition and annual metabolic panel screenings.`;
      } else if (query.toLowerCase().includes('side effect') || query.toLowerCase().includes('amoxicillin')) {
        responseText = `Common mild side effects of antibiotics like Amoxicillin include stomach upset, nausea, or diarrhea. Take with food to minimize discomfort. Contact your doctor immediately if you experience hives, facial swelling, or breathing difficulty.`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className="services-chatbot-container">
      {/* Top Banner / Intro */}
      <section className="page-intro-banner card">
        <div className="intro-icon-wrap">
          <Stethoscope size={28} className="text-teal" />
        </div>
        <div className="intro-text">
          <h1 className="font-serif intro-title">Services Showcase & Clinical AI Chatbot</h1>
          <p className="intro-sub">
            Scroll down to explore interactive service capabilities, or converse directly with PulseCare AI below.
          </p>
        </div>
      </section>

      {/* Services Showcase Stack (<ScrollStack />) */}
      <section className="scroll-stack-showcase-section">
        <div className="section-header">
          <h2 className="section-title font-serif">Comprehensive Healthcare Services</h2>
          <span className="section-badge font-mono">Lenis Scroll Interactive</span>
        </div>

        <ScrollStack useWindowScroll={false}>
          <ScrollStackItem itemClassName="service-card-item">
            <div className="service-card-grid">
              <div className="service-icon-box">
                <Stethoscope size={32} />
              </div>
              <div className="service-content">
                <span className="service-category font-mono">Module 01</span>
                <h3 className="font-serif service-title">Early Disease Risk Screening</h3>
                <p className="service-description">
                  Advanced risk algorithms for Chronic Kidney Disease, Diabetes, Cancer, Alzheimer's, and Parkinson's. Receive structured risk metrics and downloadable reports.
                </p>
                <div className="service-features">
                  <span><CheckCircle2 size={14} /> Guided Clinical Questionnaire</span>
                  <span><CheckCircle2 size={14} /> Low / Moderate / High Scoring</span>
                  <span><CheckCircle2 size={14} /> Exportable Clinical PDF Summary</span>
                </div>
              </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="service-card-item">
            <div className="service-card-grid">
              <div className="service-icon-box">
                <Bot size={32} />
              </div>
              <div className="service-content">
                <span className="service-category font-mono">Module 02</span>
                <h3 className="font-serif service-title">AI Clinical QA & Voice Assistant</h3>
                <p className="service-description">
                  Natural language medical dialogue with text-to-speech reading capabilities and speech-to-text voice recognition for accessible patient consultation.
                </p>
                <div className="service-features">
                  <span><CheckCircle2 size={14} /> Speech Synthesis Read Aloud</span>
                  <span><CheckCircle2 size={14} /> Voice Input Microphone Toggle</span>
                  <span><CheckCircle2 size={14} /> Instant Specialist Recommendations</span>
                </div>
              </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="service-card-item">
            <div className="service-card-grid">
              <div className="service-icon-box icon-box-rose">
                <ShieldAlert size={32} />
              </div>
              <div className="service-content">
                <span className="service-category font-mono">Module 03</span>
                <h3 className="font-serif service-title">Emergency 108 Dispatch Simulation</h3>
                <p className="service-description">
                  One-tap rapid SOS ambulance dispatch, automatic browser GPS coordinate capture, emergency hotline quick dials, and 6 step-by-step first-aid manuals.
                </p>
                <div className="service-features">
                  <span><CheckCircle2 size={14} /> 10-Second Countdown Dispatch</span>
                  <span><CheckCircle2 size={14} /> GPS Latitude / Longitude Telemetry</span>
                  <span><CheckCircle2 size={14} /> CPR & Choking First-Aid Guides</span>
                </div>
              </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="service-card-item">
            <div className="service-card-grid">
              <div className="service-icon-box">
                <FileSpreadsheet size={32} />
              </div>
              <div className="service-content">
                <span className="service-category font-mono">Module 04</span>
                <h3 className="font-serif service-title">Prescription & Medical Records Vault</h3>
                <p className="service-description">
                  Interactive daily medication schedules with "Mark Taken" tracking, historical lab report vault, and personalized precautionary health advice.
                </p>
                <div className="service-features">
                  <span><CheckCircle2 size={14} /> Daily Prescription Checklist</span>
                  <span><CheckCircle2 size={14} /> Report Document Drag & Drop Vault</span>
                  <span><CheckCircle2 size={14} /> Hydration & Step Counter Logs</span>
                </div>
              </div>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </section>

      {/* Main Chatbot Interface */}
      <section className="chatbot-section card">
        {/* Persistent Medical Disclaimer Callout */}
        <div className="medical-disclaimer-callout">
          <AlertCircle size={18} className="disclaimer-icon" />
          <p>
            <strong>Clinical Disclaimer:</strong> PulseCare AI provides informational reference and preliminary screening guidance. It does not constitute formal medical diagnosis or emergency treatment. In acute life-threatening situations, use the <a href="/emergency">SOS 108 Emergency Window</a> immediately.
          </p>
        </div>

        {/* Quick Topic Chips */}
        <div className="quick-chips-wrapper">
          <span className="chips-label font-mono">Quick Consult:</span>
          <div className="chips-list">
            {topicChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="chip-btn"
                onClick={() => handleSendMessage(chip.prompt)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message History */}
        <div className="chat-messages-box">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}
            >
              <div className="msg-avatar">
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="msg-bubble">
                <div className="msg-header">
                  <span className="msg-author font-serif">
                    {msg.sender === 'user' ? user.name : 'PulseCare AI Assistant'}
                  </span>
                  <span className="msg-time font-mono">{msg.timestamp}</span>
                </div>
                <div className="msg-text">{msg.text}</div>

                {/* Speech Synthesis Control for AI Messages */}
                {msg.sender === 'ai' && (
                  <div className="msg-controls">
                    <button
                      type="button"
                      className={`speech-btn ${speakingMsgId === msg.id && isSpeaking ? 'active' : ''}`}
                      onClick={() => handleReadAloud(msg.id, msg.text)}
                      title="Read Message Aloud (Speech Synthesis)"
                    >
                      {speakingMsgId === msg.id && isSpeaking ? (
                        <>
                          <VolumeX size={14} /> <span>Stop Speaking</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={14} /> <span>Read Aloud</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Chat Input Bar with Speech Recognition Mic Toggle */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="chat-input-form"
        >
          <button
            type="button"
            className={`mic-toggle-btn ${isListening ? 'listening' : ''}`}
            onClick={handleMicToggle}
            title={isListening ? 'Listening... Speak now' : 'Toggle Voice Input (Speech Recognition)'}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            className="chat-text-input"
            placeholder={isListening ? 'Listening to your voice...' : 'Type symptoms, medical questions, or request advice...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button type="submit" className="btn btn-primary chat-send-btn">
            <span>Send</span>
            <Send size={16} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default ServicesChatbotScreen;
