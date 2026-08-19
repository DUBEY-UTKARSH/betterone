import { useState } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Search,
} from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../data/mockData';
import './AppointmentsScreen.css';

const STATUS_MAP = {
  confirmed: { label: 'Confirmed', badge: 'badge-teal' },
  pending: { label: 'Pending', badge: 'badge-amber' },
  completed: { label: 'Completed', badge: 'badge-success' },
  cancelled: { label: 'Cancelled', badge: 'badge-rose' },
};

const AppointmentsScreen = () => {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newAppt, setNewAppt] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
    type: 'New Consultation',
    reason: '',
  });

  const filtered = appointments.filter((apt) => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleCreateAppt = (e) => {
    e.preventDefault();
    if (!newAppt.patientName || !newAppt.doctorName || !newAppt.date || !newAppt.time) return;
    const created = {
      id: `APT-${Date.now()}`,
      patientId: 'PT-NEW',
      patientName: newAppt.patientName,
      doctorId: 'DR-NEW',
      doctorName: newAppt.doctorName,
      specialty: 'General',
      date: newAppt.date,
      time: newAppt.time,
      duration: 30,
      type: newAppt.type,
      reason: newAppt.reason,
      status: 'pending',
      notes: '',
    };
    setAppointments((prev) => [created, ...prev]);
    setNewAppt({ patientName: '', doctorName: '', date: '', time: '', type: 'New Consultation', reason: '' });
    setShowForm(false);
  };

  return (
    <div className="appointments-container">
      {/* Intro */}
      <section className="page-intro-banner card">
        <div className="intro-icon-wrap">
          <CalendarDays size={28} />
        </div>
        <div>
          <h1 className="font-serif intro-title">Patient Appointments</h1>
          <p className="intro-sub">
            Schedule, manage, and track patient consultations across all departments.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginLeft: 'auto' }}
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} /> New Appointment
        </button>
      </section>

      {/* New Appointment Form */}
      {showForm && (
        <form className="card appointment-form" onSubmit={handleCreateAppt}>
          <h3 className="font-serif form-title">Create New Appointment</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Patient Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Eleanor Vance"
                value={newAppt.patientName}
                onChange={(e) => setNewAppt({ ...newAppt, patientName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Doctor</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Dr. Ananya Sharma"
                value={newAppt.doctorName}
                onChange={(e) => setNewAppt({ ...newAppt, doctorName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={newAppt.date}
                onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-input"
                value={newAppt.time}
                onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="form-input"
                value={newAppt.type}
                onChange={(e) => setNewAppt({ ...newAppt, type: e.target.value })}
              >
                <option>New Consultation</option>
                <option>Follow-up</option>
                <option>Annual Checkup</option>
                <option>Emergency</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Reason for Visit</label>
              <input
                type="text"
                className="form-input"
                placeholder="Brief description of the visit reason"
                value={newAppt.reason}
                onChange={(e) => setNewAppt({ ...newAppt, reason: e.target.value })}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Appointment
            </button>
          </div>
        </form>
      )}

      {/* Filters & Search */}
      <div className="filters-bar card">
        <div className="search-box">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by patient, doctor, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {['all', 'confirmed', 'pending', 'completed'].map((status) => (
            <button
              key={status}
              type="button"
              className={`filter-chip ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'All' : STATUS_MAP[status]?.label || status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="card appointments-table-wrap">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-muted" style={{ textAlign: 'center', padding: '32px 0' }}>
                  No appointments match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((apt) => (
                <tr key={apt.id}>
                  <td className="font-mono text-muted">{apt.id}</td>
                  <td>{apt.patientName}</td>
                  <td>{apt.doctorName}</td>
                  <td>
                    <span className="font-mono">{apt.date}</span>
                    <br />
                    <span className="font-mono text-muted">{apt.time}</span>
                  </td>
                  <td>{apt.type}</td>
                  <td>
                    <span className={`badge ${STATUS_MAP[apt.status]?.badge || 'badge-teal'}`}>
                      {STATUS_MAP[apt.status]?.label || apt.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      {apt.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            className="action-btn confirm"
                            title="Confirm"
                            onClick={() => updateStatus(apt.id, 'confirmed')}
                          >
                            <CheckCircle2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="action-btn cancel"
                            title="Cancel"
                            onClick={() => updateStatus(apt.id, 'cancelled')}
                          >
                            <XCircle size={15} />
                          </button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <button
                          type="button"
                          className="action-btn complete"
                          title="Mark Completed"
                          onClick={() => updateStatus(apt.id, 'completed')}
                        >
                          <CheckCircle2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsScreen;
