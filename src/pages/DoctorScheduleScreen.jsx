import { useState } from 'react';
import {
  Stethoscope,
  Star,
  Clock,
  CalendarDays,
  Users,
  ChevronRight,
} from 'lucide-react';
import { MOCK_DOCTORS, MOCK_APPOINTMENTS } from '../data/mockData';
import './DoctorScheduleScreen.css';

const DoctorScheduleScreen = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const getDoctorAppointments = (doctorId) =>
    MOCK_APPOINTMENTS.filter((a) => a.doctorId === doctorId);

  return (
    <div className="doctor-schedule-container">
      {/* Intro */}
      <section className="page-intro-banner card">
        <div className="intro-icon-wrap">
          <Stethoscope size={28} />
        </div>
        <div>
          <h1 className="font-serif intro-title">Doctor Schedules</h1>
          <p className="intro-sub">
            View physician availability, upcoming consultations, and department rosters.
          </p>
        </div>
      </section>

      {/* Doctor Grid */}
      <section className="doctor-grid">
        {MOCK_DOCTORS.map((doc) => (
          <div
            key={doc.id}
            className={`doctor-card card ${selectedDoctor === doc.id ? 'selected' : ''}`}
            onClick={() => setSelectedDoctor(selectedDoctor === doc.id ? null : doc.id)}
          >
            <div className="doc-card-header">
              <div className="doc-avatar">
                <Stethoscope size={24} />
              </div>
              <div className="doc-header-info">
                <h3 className="font-serif doc-name">{doc.name}</h3>
                <span className="doc-specialty badge badge-teal">{doc.specialty}</span>
              </div>
            </div>

            <div className="doc-meta-grid">
              <div className="doc-meta-item">
                <Star size={14} className="text-amber" />
                <span className="font-mono">{doc.rating}</span>
                <span className="text-muted">rating</span>
              </div>
              <div className="doc-meta-item">
                <Clock size={14} className="text-teal" />
                <span className="font-mono">{doc.experience}yr</span>
                <span className="text-muted">experience</span>
              </div>
              <div className="doc-meta-item">
                <Users size={14} className="text-blue" />
                <span className="font-mono">{doc.consultations.toLocaleString()}</span>
                <span className="text-muted">consultations</span>
              </div>
              <div className="doc-meta-item">
                <CalendarDays size={14} className="text-success" />
                <span className="font-mono">{doc.availableSlots}</span>
                <span className="text-muted">slots open</span>
              </div>
            </div>

            <div className="doc-card-footer">
              <div className="doc-next-available">
                <span className="text-muted">Next available:</span>
                <span className="font-mono">{doc.nextAvailable}</span>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </div>
          </div>
        ))}
      </section>

      {/* Selected Doctor Schedule Detail */}
      {selectedDoctor && (
        <section className="card schedule-detail-section">
          {(() => {
            const doc = MOCK_DOCTORS.find((d) => d.id === selectedDoctor);
            if (!doc) return null;
            const docApts = getDoctorAppointments(doc.id);
            return (
              <>
                <div className="section-header">
                  <h2 className="section-title font-serif">
                    <Stethoscope size={18} className="text-teal" /> {doc.name}'s Schedule
                  </h2>
                  <span className="text-muted font-mono">{doc.department}</span>
                </div>

                {/* Contact & Info */}
                <div className="schedule-info-grid">
                  <div className="schedule-info-item">
                    <span className="info-label">Qualification</span>
                    <span className="info-value">{doc.qualification}</span>
                  </div>
                  <div className="schedule-info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value font-mono">{doc.email}</span>
                  </div>
                  <div className="schedule-info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value font-mono">{doc.phone}</span>
                  </div>
                  <div className="schedule-info-item">
                    <span className="info-label">Available Slots</span>
                    <span className="info-value font-mono text-success">{doc.availableSlots} remaining</span>
                  </div>
                </div>

                {/* Appointments List */}
                <h3 className="font-serif schedule-subtitle">Upcoming & Recent Appointments</h3>
                {docApts.length === 0 ? (
                  <p className="text-muted" style={{ padding: '12px 0' }}>
                    No appointments scheduled for this doctor.
                  </p>
                ) : (
                  <div className="schedule-apts-list">
                    {docApts.map((apt) => (
                      <div key={apt.id} className="schedule-apt-item">
                        <div className="schedule-apt-time font-mono">
                          {apt.date}
                          <br />
                          {apt.time}
                        </div>
                        <div className="schedule-apt-info">
                          <div className="schedule-apt-patient">{apt.patientName}</div>
                          <div className="text-muted">{apt.reason}</div>
                          <span className="font-mono text-muted" style={{ fontSize: '12px' }}>
                            {apt.id} · {apt.duration}min
                          </span>
                        </div>
                        <span className={`badge ${apt.status === 'confirmed' ? 'badge-teal' : apt.status === 'completed' ? 'badge-success' : 'badge-amber'}`}>
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </section>
      )}
    </div>
  );
};

export default DoctorScheduleScreen;
