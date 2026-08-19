import { useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import CircularText from './components/reactbits/CircularText';
import Navbar from './components/Navbar';
import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen';
import ServicesChatbotScreen from './pages/ServicesChatbotScreen';
import EarlyDetectionScreen from './pages/EarlyDetectionScreen';
import EmergencyScreen from './pages/EmergencyScreen';
import MyHealthScreen from './pages/MyHealthScreen';
import ImproveScreen from './pages/ImproveScreen';
import ProfileScreen from './pages/ProfileScreen';
import DashboardScreen from './pages/DashboardScreen';
import AppointmentsScreen from './pages/AppointmentsScreen';
import DoctorScheduleScreen from './pages/DoctorScheduleScreen';
import MedicalRecordsScreen from './pages/MedicalRecordsScreen';
import FeedbackScreen from './pages/FeedbackScreen';
import './index.css';

const Footer = () => {
  const footerRef = useRef(null);
  const { pathname } = useLocation();
  const isLoginPage = pathname === '/login';
  const inView = useInView(footerRef, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <footer ref={footerRef} className="app-footer">
      {!isLoginPage && (
        <motion.div
          className="footer-circular-badge"
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 30 }}
          transition={{ type: 'spring', damping: 16, stiffness: 120 }}
        >
          <CircularText
            text="PULSECARE*AI*ALWAYS*ON*"
            onHover="speedUp"
            spinDuration={25}
            className="footer-circular-text"
          />
        </motion.div>
      )}
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo-text">PulseCare <span className="font-serif">AI</span></span>
          <span className="footer-tagline">Clinical Intelligence · Always On</span>
        </div>
        <div className="footer-links">
          <span>© 2026 PulseCare AI</span>
          <span>·</span>
          <span>Not a substitute for professional medical advice</span>
          <span>·</span>
          <a href="/emergency" className="footer-emergency-link">Emergency SOS 108</a>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LoginScreen />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/appointments" element={<AppointmentsScreen />} />
              <Route path="/doctor-schedule" element={<DoctorScheduleScreen />} />
              <Route path="/medical-records" element={<MedicalRecordsScreen />} />
              <Route path="/feedback" element={<FeedbackScreen />} />
              <Route path="/services" element={<ServicesChatbotScreen />} />
              <Route path="/chatbot" element={<ServicesChatbotScreen />} />
              <Route path="/early-detection" element={<EarlyDetectionScreen />} />
              <Route path="/emergency" element={<EmergencyScreen />} />
              <Route path="/my-health" element={<MyHealthScreen />} />
              <Route path="/improve" element={<ImproveScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
