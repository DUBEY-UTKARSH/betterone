import { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Eye,
  Tag,
  Stethoscope,
  Clock,
} from 'lucide-react';
import { MOCK_MEDICAL_RECORDS } from '../data/mockData';
import './MedicalRecordsScreen.css';

const TYPE_BADGES = {
  'Lab Report': 'badge-teal',
  'Radiology': 'badge-amber',
  'ECG Report': 'badge-rose',
  'Pulmonary Function': 'badge-success',
  'Neurology Assessment': 'badge-teal',
};

const MedicalRecordsScreen = () => {
  const [records] = useState(MOCK_MEDICAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const recordTypes = ['all', ...new Set(MOCK_MEDICAL_RECORDS.map((r) => r.type))];

  const filtered = records.filter((rec) => {
    const matchesType = filterType === 'all' || rec.type === filterType;
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="medical-records-container">
      {/* Intro */}
      <section className="page-intro-banner card">
        <div className="intro-icon-wrap">
          <FileText size={28} />
        </div>
        <div>
          <h1 className="font-serif intro-title">Medical Records Archive</h1>
          <p className="intro-sub">
            Access lab reports, radiology, ECG, and diagnostic assessments with full search and filtering.
          </p>
        </div>
      </section>

      {/* Filters Bar */}
      <div className="filters-bar card">
        <div className="search-box">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, patient, doctor, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {recordTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={`filter-chip ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      <section className="records-grid">
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <p className="text-muted">No records match your search criteria.</p>
          </div>
        ) : (
          filtered.map((rec) => (
            <div
              key={rec.id}
              className={`record-card card ${selectedRecord === rec.id ? 'selected' : ''}`}
              onClick={() => setSelectedRecord(selectedRecord === rec.id ? null : rec.id)}
            >
              <div className="record-header">
                <div className="record-type-icon">
                  <FileText size={20} className="text-teal" />
                </div>
                <div className="record-header-info">
                  <span className={`badge ${TYPE_BADGES[rec.type] || 'badge-teal'}`}>{rec.type}</span>
                  <span className={`badge ${rec.status === 'final' ? 'badge-success' : 'badge-amber'}`}>
                    {rec.status}
                  </span>
                </div>
              </div>

              <h3 className="font-serif record-title">{rec.title}</h3>
              <p className="text-muted record-patient">{rec.patientName}</p>

              <div className="record-meta-row">
                <div className="record-meta-item">
                  <Stethoscope size={13} className="text-muted" />
                  <span>{rec.doctor}</span>
                </div>
                <div className="record-meta-item">
                  <Clock size={13} className="text-muted" />
                  <span className="font-mono">{rec.date}</span>
                </div>
              </div>

              {/* Expanded Summary */}
              {selectedRecord === rec.id && (
                <div className="record-expanded">
                  <div className="record-dept">
                    <span className="text-muted">Department:</span> {rec.department}
                  </div>
                  <p className="record-summary">{rec.summary}</p>
                  <div className="record-tags">
                    {rec.tags.map((tag) => (
                      <span key={tag} className="record-tag font-mono">
                        <Tag size={11} /> {tag}
                      </span>
                    ))}
                  </div>
                  <div className="record-actions">
                    <button type="button" className="btn btn-outline btn-sm">
                      <Eye size={14} /> View Full Report
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm">
                      <Download size={14} /> Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* Summary Footer */}
      <div className="records-summary card">
        <span className="text-muted">
          Showing <strong className="text-main">{filtered.length}</strong> of{' '}
          <strong className="text-main">{records.length}</strong> records
        </span>
      </div>
    </div>
  );
};

export default MedicalRecordsScreen;
