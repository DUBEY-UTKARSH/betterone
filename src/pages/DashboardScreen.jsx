import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Activity,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText,
  TrendingUp,
  Bell,
  ChevronRight,
} from 'lucide-react';
import {
  MOCK_DEPARTMENT_STATS,
  MOCK_APPOINTMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_PATIENTS,
  MOCK_VITALS_HISTORY,
} from '../data/mockData';
import './DashboardScreen.css';

const DashboardScreen = () => {
  const navigate = useNavigate();
  const todayApts = MOCK_APPOINTMENTS.filter(
    (a) => a.date === '2026-08-18' && a.status === 'confirmed'
  );
  const pendingApts = MOCK_APPOINTMENTS.filter((a) => a.status === 'pending');
  const totalPatients = MOCK_PATIENTS.length;
  const criticalPatients = MOCK_PATIENTS.filter((p) => p.status === 'critical').length;
  const latestVitals = MOCK_VITALS_HISTORY[0];

  return (
    <div className="dashboard-container">
      {/* Intro Banner */}
      <section className="page-intro-banner card">
        <div className="intro-icon-wrap">
          <LayoutDashboard size={28} />
        </div>
        <div>
          <h1 className="font-serif intro-title">Clinical Dashboard</h1>
          <p className="intro-sub">
            Real-time overview of patient activity, department performance, and critical alerts.
          </p>
        </div>
      </section>

      {/* KPI Strip */}
      <section className="kpi-strip">
        <div className="kpi-card card">
          <div className="kpi-icon-wrap kpi-blue">
            <CalendarDays size={20} />
          </div>
          <div className="kpi-data">
            <span className="kpi-value font-mono">{todayApts.length}</span>
            <span className="kpi-label">Today's Appointments</span>
          </div>
        </div>
        <div className="kpi-card card">
          <div className="kpi-icon-wrap kpi-teal">
            <Users size={20} />
          </div>
          <div className="kpi-data">
            <span className="kpi-value font-mono">{totalPatients}</span>
            <span className="kpi-label">Active Patients</span>
          </div>
        </div>
        <div className="kpi-card card">
          <div className="kpi-icon-wrap kpi-amber">
            <Clock size={20} />
          </div>
          <div className="kpi-data">
            <span className="kpi-value font-mono">{pendingApts.length}</span>
            <span className="kpi-label">Pending Confirmations</span>
          </div>
        </div>
        <div className="kpi-card card">
          <div className="kpi-icon-wrap kpi-rose">
            <AlertTriangle size={20} />
          </div>
          <div className="kpi-data">
            <span className="kpi-value font-mono">{criticalPatients}</span>
            <span className="kpi-label">Critical Patients</span>
          </div>
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-col-left">
          {/* Today's Schedule */}
          <section className="card dashboard-section">
            <div className="section-header">
              <h2 className="section-title font-serif">
                <Clock size={18} className="text-teal" /> Today's Schedule
              </h2>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/appointments')}
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="schedule-list">
              {todayApts.length === 0 ? (
                <p className="text-muted" style={{ padding: '12px 0' }}>No confirmed appointments today.</p>
              ) : (
                todayApts.map((apt) => (
                  <div key={apt.id} className="schedule-item">
                    <div className="schedule-time font-mono">{apt.time}</div>
                    <div className="schedule-details">
                      <div className="schedule-patient">{apt.patientName}</div>
                      <div className="schedule-meta text-muted">
                        {apt.doctorName} · {apt.specialty} · {apt.duration}min
                      </div>
                    </div>
                    <span className={`badge ${apt.status === 'confirmed' ? 'badge-teal' : 'badge-amber'}`}>
                      {apt.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Department Performance */}
          <section className="card dashboard-section">
            <div className="section-header">
              <h2 className="section-title font-serif">
                <Stethoscope size={18} className="text-teal" /> Department Overview
              </h2>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/doctor-schedule')}
              >
                Schedules <ChevronRight size={14} />
              </button>
            </div>
            <div className="dept-table">
              <div className="dept-row dept-header">
                <span>Department</span>
                <span>Appts Today</span>
                <span>Active Patients</span>
                <span>Avg Wait</span>
              </div>
              {MOCK_DEPARTMENT_STATS.map((dept) => (
                <div key={dept.name} className="dept-row">
                  <span className="dept-name">{dept.name}</span>
                  <span className="font-mono">{dept.appointmentsToday}</span>
                  <span className="font-mono">{dept.patientsActive}</span>
                  <span className="font-mono text-success">{dept.avgWait}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="dashboard-col-right">
          {/* Notifications / Alerts */}
          <section className="card dashboard-section">
            <div className="section-header">
              <h2 className="section-title font-serif">
                <Bell size={18} className="text-amber" /> Alerts & Notifications
              </h2>
            </div>
            <div className="notif-list">
              {MOCK_NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className={`notif-item notif-${notif.type}`}>
                  <div className="notif-icon">
                    {notif.type === 'alert' && <AlertTriangle size={16} />}
                    {notif.type === 'reminder' && <Clock size={16} />}
                    {notif.type === 'info' && <FileText size={16} />}
                  </div>
                  <div className="notif-body">
                    <p className="notif-msg">{notif.message}</p>
                    <span className="notif-time font-mono">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Stats — Vitals Trend */}
          <section className="card dashboard-section">
            <div className="section-header">
              <h2 className="section-title font-serif">
                <Activity size={18} className="text-teal" /> Latest Vitals (Patient Demo)
              </h2>
            </div>
            <div className="vitals-mini-grid">
              <div className="vitals-mini-card">
                <span className="vitals-mini-label">Heart Rate</span>
                <span className="vitals-mini-value font-mono">{latestVitals.heartRate} bpm</span>
              </div>
              <div className="vitals-mini-card">
                <span className="vitals-mini-label">Blood Pressure</span>
                <span className="vitals-mini-value font-mono">{latestVitals.bpSys}/{latestVitals.bpDia}</span>
              </div>
              <div className="vitals-mini-card">
                <span className="vitals-mini-label">Glucose</span>
                <span className="vitals-mini-value font-mono">{latestVitals.glucose} mg/dL</span>
              </div>
              <div className="vitals-mini-card">
                <span className="vitals-mini-label">Temperature</span>
                <span className="vitals-mini-value font-mono">{latestVitals.temperature}°F</span>
              </div>
            </div>
            <div className="vitals-history-list">
              {MOCK_VITALS_HISTORY.slice(1).map((v) => (
                <div key={v.date} className="vitals-history-row">
                  <span className="font-mono text-muted">{v.date}</span>
                  <span className="font-mono">{v.heartRate} bpm</span>
                  <span className="font-mono">{v.bpSys}/{v.bpDia}</span>
                  <span className="font-mono">{v.glucose} mg/dL</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section className="card dashboard-section quick-links">
            <h3 className="font-serif quick-links-title">Quick Navigation</h3>
            <div className="quick-links-grid">
              <button type="button" className="quick-link" onClick={() => navigate('/appointments')}>
                <CalendarDays size={20} className="text-teal" />
                <span>Appointments</span>
                <ArrowRight size={14} className="text-muted" />
              </button>
              <button type="button" className="quick-link" onClick={() => navigate('/doctor-schedule')}>
                <Stethoscope size={20} className="text-teal" />
                <span>Doctor Schedule</span>
                <ArrowRight size={14} className="text-muted" />
              </button>
              <button type="button" className="quick-link" onClick={() => navigate('/medical-records')}>
                <FileText size={20} className="text-blue" />
                <span>Medical Records</span>
                <ArrowRight size={14} className="text-muted" />
              </button>
              <button type="button" className="quick-link" onClick={() => navigate('/my-health')}>
                <TrendingUp size={20} className="text-amber" />
                <span>My Health Vault</span>
                <ArrowRight size={14} className="text-muted" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
