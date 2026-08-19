import { useState } from 'react';
import {
  MessageSquareHeart,
  Star,
  Send,
  CheckCircle2,
  Bug,
  Lightbulb,
  Palette,
  Gauge,
  ThumbsUp,
  Mail,
} from 'lucide-react';
import './FeedbackScreen.css';

const CATEGORIES = [
  { id: 'bug', label: 'Bug Report', icon: <Bug size={16} /> },
  { id: 'feature', label: 'Feature Request', icon: <Lightbulb size={16} /> },
  { id: 'ux', label: 'UX / UI', icon: <Palette size={16} /> },
  { id: 'performance', label: 'Performance', icon: <Gauge size={16} /> },
  { id: 'general', label: 'General Feedback', icon: <ThumbsUp size={16} /> },
];

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

const FeedbackScreen = () => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const activeRating = hoveredStar || rating;

  const canSubmit = rating > 0 && category && message.trim().length >= 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const feedback = {
      id: `FB-${Date.now()}`,
      rating,
      category,
      message: message.trim(),
      email: email.trim() || null,
      timestamp: new Date().toISOString(),
    };

    // Persist to localStorage
    const existing = JSON.parse(localStorage.getItem('pulsecare_feedback') || '[]');
    existing.push(feedback);
    localStorage.setItem('pulsecare_feedback', JSON.stringify(existing));

    setSubmittedData(feedback);
    setSubmitted(true);
  };

  const handleReset = () => {
    setRating(0);
    setCategory('');
    setMessage('');
    setEmail('');
    setSubmitted(false);
    setSubmittedData(null);
  };

  if (submitted) {
    return (
      <div className="feedback-container">
        <div className="card feedback-success-card">
          <div className="success-icon-wrap">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="font-serif success-title">Thank You for Your Feedback!</h2>
          <p className="success-sub">
            Your input helps us improve PulseCare AI for everyone.
          </p>
          <div className="success-summary">
            <div className="success-row">
              <span className="text-muted">Rating</span>
              <span className="font-mono">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < submittedData.rating ? 'currentColor' : 'none'}
                    className={i < submittedData.rating ? 'text-primary' : 'text-muted'}
                  />
                ))}
              </span>
            </div>
            <div className="success-row">
              <span className="text-muted">Category</span>
              <span>{CATEGORIES.find((c) => c.id === submittedData.category)?.label}</span>
            </div>
            <div className="success-row">
              <span className="text-muted">Reference</span>
              <span className="font-mono text-muted">{submittedData.id}</span>
            </div>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleReset}>
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      {/* Intro */}
      <section className="page-intro-banner card">
        <div className="intro-icon-wrap">
          <MessageSquareHeart size={28} />
        </div>
        <div>
          <h1 className="font-serif intro-title">Send Us Feedback</h1>
          <p className="intro-sub">
            Help us improve PulseCare AI — report bugs, suggest features, or share your experience.
          </p>
        </div>
      </section>

      <form className="feedback-form card" onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="feedback-section">
          <label className="form-label">How would you rate your experience?</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= activeRating ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star size={28} fill={star <= activeRating ? 'currentColor' : 'none'} />
              </button>
            ))}
            {activeRating > 0 && (
              <span className="rating-label font-mono">{RATING_LABELS[activeRating]}</span>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="feedback-section">
          <label className="form-label">Category</label>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-chip ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="feedback-section">
          <label className="form-label">
            Your feedback
            <span className="text-muted" style={{ fontWeight: 400, marginLeft: '6px' }}>
              (min 10 characters)
            </span>
          </label>
          <textarea
            className="form-input feedback-textarea"
            placeholder="Tell us what you think — what's working, what's not, or what you'd love to see next..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
          />
          <div className="char-count font-mono">
            {message.length} characters
          </div>
        </div>

        {/* Optional Email */}
        <div className="feedback-section">
          <label className="form-label">
            <Mail size={14} className="text-muted" style={{ marginRight: '6px' }} />
            Email
            <span className="text-muted" style={{ fontWeight: 400, marginLeft: '6px' }}>
              (optional — for follow-up)
            </span>
          </label>
          <input
            type="email"
            className="form-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="feedback-submit-row">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!canSubmit}
          >
            <Send size={16} />
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackScreen;
