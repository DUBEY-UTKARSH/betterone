import React, { useState, useRef } from 'react';
import {
  Pill, FileText, Upload, CheckCircle2, Circle,
  Clock, Calendar, Trash2, Eye, Download
} from 'lucide-react';
import './MyHealthScreen.css';

const INITIAL_MEDICATIONS = [
  { id: 1, name: 'Metformin 500mg', time: '08:00 AM', frequency: 'Daily', taken: false, color: '#96D7C6' },
  { id: 2, name: 'Lisinopril 10mg', time: '09:00 AM', frequency: 'Daily', taken: false, color: '#7EC4B1' },
  { id: 3, name: 'Atorvastatin 20mg', time: '09:00 PM', frequency: 'Daily', taken: true, color: '#6C8CBF' },
  { id: 4, name: 'Aspirin 81mg', time: '12:00 PM', frequency: 'With lunch', taken: false, color: '#E2D36B' },
  { id: 5, name: 'Vitamin D3 2000 IU', time: '08:00 AM', frequency: 'Daily with breakfast', taken: true, color: '#5FAE7A' }
];

const INITIAL_REPORTS = [
  { id: 1, name: 'CBC Blood Panel — March 2026', type: 'Lab Report', date: '2026-03-14', size: '245 KB' },
  { id: 2, name: 'Chest X-Ray — Jan 2026', type: 'Radiology', date: '2026-01-22', size: '1.8 MB' },
  { id: 3, name: 'Lipid Profile — Feb 2026', type: 'Lab Report', date: '2026-02-05', size: '128 KB' }
];

const MyHealthScreen = () => {
  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [activeTab, setActiveTab] = useState('meds');
  const fileInputRef = useRef(null);

  const toggleMedTaken = (id) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  const takenCount = medications.filter((m) => m.taken).length;
  const totalCount = medications.length;
  const adherencePct = Math.round((takenCount / totalCount) * 100);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const newReport = {
        id: Date.now() + Math.random(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: file.type.includes('image') ? 'Radiology' : 'Lab Report',
        date: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024).toFixed(0)} KB`
      };
      setReports((prev) => [newReport, ...prev]);
    });
  };

  const handleDeleteReport = (id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="my-health-container">
      {/* Intro */}
      <section className="page-intro-banner card">
        <div className="intro-icon-wrap">
          <Pill size={28} />
        </div>
        <div className="intro-text">
          <h1 className="font-serif intro-title">My Health Vault & Prescriptions</h1>
          <p className="intro-sub">
            Track daily medications, manage prescription schedules, and organize your medical report archive.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="health-tabs">
        <button
          type="button"
          className={`health-tab ${activeTab === 'meds' ? 'active' : ''}`}
          onClick={() => setActiveTab('meds')}
        >
          <Pill size={16} /> Medications
        </button>
        <button
          type="button"
          className={`health-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText size={16} /> Medical Reports Vault
        </button>
      </div>

      {activeTab === 'meds' ? (
        <section className="meds-section">
          {/* Adherence Strip */}
          <div className="adherence-strip card">
            <div className="adherence-info">
              <span className="adherence-label font-mono">TODAY'S ADHERENCE</span>
              <span className="adherence-fraction font-mono">{takenCount}/{totalCount} taken</span>
            </div>
            <div className="adherence-bar">
              <div
                className="adherence-fill"
                style={{ width: `${adherencePct}%`, background: adherencePct >= 80 ? '#5FAE7A' : '#E2D36B' }}
              />
            </div>
            <div className="adherence-pct" style={{ color: adherencePct >= 80 ? '#5FAE7A' : '#E2D36B' }}>
              {adherencePct}%
            </div>
          </div>

          {/* Medication Checklist */}
          <div className="meds-list">
            {medications.map((med) => (
              <div key={med.id} className={`med-item card ${med.taken ? 'taken' : ''}`}>
                <div className="med-color-dot" style={{ background: med.color }} />
                <div className="med-info">
                  <div className="med-name font-serif">{med.name}</div>
                  <div className="med-meta">
                    <span className="font-mono med-time">
                      <Clock size={12} /> {med.time}
                    </span>
                    <span className="med-freq">
                      <Calendar size={12} /> {med.frequency}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`mark-taken-btn ${med.taken ? 'taken' : ''}`}
                  onClick={() => toggleMedTaken(med.id)}
                >
                  {med.taken ? (
                    <><CheckCircle2 size={16} /> Taken</>
                  ) : (
                    <><Circle size={16} /> Mark Taken</>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Prescription Info Card */}
          <div className="rx-info-card card">
            <h3 className="font-serif rx-title">
              <Calendar size={18} className="text-teal" /> Current Prescription Schedule
            </h3>
            <div className="rx-schedule-table">
              <div className="rx-row rx-header">
                <span>Medication</span>
                <span>Dosage</span>
                <span>Timing</span>
                <span>Prescribing Physician</span>
              </div>
              <div className="rx-row">
                <span>Metformin</span>
                <span className="font-mono">500mg × 2</span>
                <span>With meals</span>
                <span>Dr. A. Sharma</span>
              </div>
              <div className="rx-row">
                <span>Lisinopril</span>
                <span className="font-mono">10mg × 1</span>
                <span>Morning</span>
                <span>Dr. P. Mehta</span>
              </div>
              <div className="rx-row">
                <span>Atorvastatin</span>
                <span className="font-mono">20mg × 1</span>
                <span>Night</span>
                <span>Dr. A. Sharma</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="reports-section">
          {/* Upload */}
          <div className="reports-upload-zone card" onClick={() => fileInputRef.current?.click()}>
            <Upload size={28} className="text-teal" />
            <div className="upload-text">
              <strong>Click or drag files here to upload</strong>
              <span className="font-mono upload-sub">PDF, JPG, PNG — max 25 MB each</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>

          {/* Reports List */}
          <div className="reports-list">
            {reports.map((report) => (
              <div key={report.id} className="report-item card">
                <div className="report-icon">
                  <FileText size={22} className="text-teal" />
                </div>
                <div className="report-info">
                  <div className="report-name font-serif">{report.name}</div>
                  <div className="report-meta">
                    <span className="report-type badge badge-teal">{report.type}</span>
                    <span className="font-mono report-date">{report.date}</span>
                    <span className="report-size text-muted">{report.size}</span>
                  </div>
                </div>
                <div className="report-actions">
                  <button type="button" className="report-action-btn" title="Preview">
                    <Eye size={15} />
                  </button>
                  <button type="button" className="report-action-btn" title="Download">
                    <Download size={15} />
                  </button>
                  <button
                    type="button"
                    className="report-action-btn delete"
                    title="Remove"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MyHealthScreen;
