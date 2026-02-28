import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Save, Smile } from 'lucide-react';
import { API_URLS } from '../apiConfig';
import SectionEditor from './SectionEditor';

const CHECK_ROLE_API_BASE_URL = API_URLS.CHECK_ROLE;

/* ── Preset colour palettes the user can pick ── */
const COLOR_PRESETS = [
  { accentColor: '#60a5fa', gradientFrom: '#3b82f6', gradientTo: '#06b6d4' },
  { accentColor: '#fbbf24', gradientFrom: '#f59e0b', gradientTo: '#fb923c' },
  { accentColor: '#a78bfa', gradientFrom: '#8b5cf6', gradientTo: '#ec4899' },
  { accentColor: '#34d399', gradientFrom: '#10b981', gradientTo: '#06b6d4' },
  { accentColor: '#f87171', gradientFrom: '#ef4444', gradientTo: '#f59e0b' },
  { accentColor: '#818cf8', gradientFrom: '#6366f1', gradientTo: '#a855f7' },
];

const EMPTY_CARD = {
  emoji: '✨',
  title: '',
  description: '',
  accentColor: COLOR_PRESETS[0].accentColor,
  gradientFrom: COLOR_PRESETS[0].gradientFrom,
  gradientTo: COLOR_PRESETS[0].gradientTo,
};

const defaultFeatures = [
  {
    id: 1,
    emoji: '💻',
    title: 'Clean Code',
    description: 'Writing maintainable, scalable, and efficient code following best practices.',
    accentColor: '#60a5fa',
    gradientFrom: '#3b82f6',
    gradientTo: '#06b6d4',
  },
  {
    id: 2,
    emoji: '💡',
    title: 'Problem Solver',
    description: 'Passionate about solving complex problems with creative, innovative solutions.',
    accentColor: '#fbbf24',
    gradientFrom: '#f59e0b',
    gradientTo: '#fb923c',
  },
  {
    id: 3,
    emoji: '🚀',
    title: 'Fast Delivery',
    description: 'Committed to delivering high-quality projects on time with attention to detail.',
    accentColor: '#a78bfa',
    gradientFrom: '#8b5cf6',
    gradientTo: '#ec4899',
  },
  {
    id: 4,
    emoji: '🤝',
    title: 'Team Player',
    description: 'Excellent communication skills and collaborative environment experience.',
    accentColor: '#34d399',
    gradientFrom: '#10b981',
    gradientTo: '#06b6d4',
  },
];

const defaultStats = [
  { label: 'Years Experience', value: '3+', gradient: 'linear-gradient(135deg, #6366f1, #a855f7)' },
  { label: 'Projects Done', value: '20+', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
  { label: 'Technologies', value: '15+', gradient: 'linear-gradient(135deg, #10b981, #84cc16)' },
];

/* ═══════════════════════════════════════════════════════
   Feature Card Modal (Add / Edit)
═══════════════════════════════════════════════════════ */
const FeatureModal = ({ darkMode, initialData, onSave, onClose }) => {
  const [form, setForm] = useState(initialData || { ...EMPTY_CARD });
  const [selectedPreset, setSelectedPreset] = useState(0);

  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handlePreset = (preset, idx) => {
    setSelectedPreset(idx);
    setForm(prev => ({
      ...prev,
      accentColor: preset.accentColor,
      gradientFrom: preset.gradientFrom,
      gradientTo: preset.gradientTo,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <div className="ab-modal-overlay" onClick={onClose}>
      <div
        className={`ab-modal ${darkMode ? 'ab-modal-dark' : 'ab-modal-light'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ab-modal-header">
          <div className="ab-modal-title-row">
            <div className="ab-modal-icon" style={{ background: `linear-gradient(135deg, ${form.gradientFrom}, ${form.gradientTo})` }}>
              <span style={{ fontSize: '1.2rem' }}>{form.emoji}</span>
            </div>
            <h3 className="ab-modal-title">
              {initialData?.id ? 'Edit Card' : 'Add New Card'}
            </h3>
          </div>
          <button className="ab-modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="ab-modal-form">

          {/* Emoji + Title row */}
          <div className="ab-modal-row">
            <div className="ab-modal-field" style={{ flex: '0 0 90px' }}>
              <label className={`ab-modal-label ${darkMode ? 'ab-modal-label-dark' : 'ab-modal-label-light'}`}>Emoji</label>
              <input
                type="text"
                value={form.emoji}
                onChange={e => handleChange('emoji', e.target.value)}
                className={`ab-modal-input ab-modal-emoji-input ${darkMode ? 'ab-modal-input-dark' : 'ab-modal-input-light'}`}
                maxLength={4}
                placeholder="✨"
              />
            </div>
            <div className="ab-modal-field" style={{ flex: 1 }}>
              <label className={`ab-modal-label ${darkMode ? 'ab-modal-label-dark' : 'ab-modal-label-light'}`}>Card Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                required
                placeholder="e.g. Clean Code"
                className={`ab-modal-input ${darkMode ? 'ab-modal-input-dark' : 'ab-modal-input-light'}`}
              />
            </div>
          </div>

          {/* Description */}
          <div className="ab-modal-field">
            <label className={`ab-modal-label ${darkMode ? 'ab-modal-label-dark' : 'ab-modal-label-light'}`}>Description</label>
            <textarea
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              rows={3}
              placeholder="Brief description of this skill/quality..."
              className={`ab-modal-input ab-modal-textarea ${darkMode ? 'ab-modal-input-dark' : 'ab-modal-input-light'}`}
            />
          </div>

          {/* Colour preset picker */}
          <div className="ab-modal-field">
            <label className={`ab-modal-label ${darkMode ? 'ab-modal-label-dark' : 'ab-modal-label-light'}`}>Colour Theme</label>
            <div className="ab-color-presets">
              {COLOR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`ab-color-dot ${selectedPreset === idx ? 'ab-color-dot-selected' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${preset.gradientFrom}, ${preset.gradientTo})` }}
                  onClick={() => handlePreset(preset, idx)}
                  title={`Theme ${idx + 1}`}
                />
              ))}
            </div>
            {/* Live gradient preview */}
            <div
              className="ab-color-preview"
              style={{ background: `linear-gradient(135deg, ${form.gradientFrom}, ${form.gradientTo})` }}
            />
          </div>

          {/* Actions */}
          <div className="ab-modal-actions">
            <button type="button" className="ab-modal-cancel" onClick={onClose}>
              <X size={14} /> Cancel
            </button>
            <button
              type="submit"
              className="ab-modal-save"
              style={{ background: `linear-gradient(135deg, ${form.gradientFrom}, ${form.gradientTo})` }}
            >
              <Save size={14} />
              {initialData?.id ? 'Save Changes' : 'Add Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   Main About Component
═══════════════════════════════════════════════════════ */
const About = ({ darkMode }) => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState(defaultFeatures);
  const [stats] = useState(defaultStats);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null); // null = add mode

  // Delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Section header editable content
  const [content, setContent] = useState({
    badge: 'Who I Am',
    title: 'About',
    titleGrad: 'Me',
    subtitle: 'Passionate full-stack developer crafting beautiful, functional, and user-centered digital experiences.',
    bioName: 'M. Khalil Mejri',
    bioRole: 'Full Stack Developer',
    storyParagraph1: "I'm a dedicated full-stack developer with over 3 years of experience in creating web applications that combine beautiful design with robust functionality. My journey began with a curiosity about how websites work, which evolved into a passion for building digital solutions that make a real difference.",
    storyParagraph2: "I specialize in modern JavaScript frameworks, backend technologies, and database design. When I'm not coding, you'll find me exploring new technologies or contributing to open-source communities.",
  });

  useEffect(() => {
    const checkAdminRole = async () => {
      const adminEmail = localStorage.getItem('adminEmail');
      if (!adminEmail) return;
      try {
        const response = await axios.get(`${CHECK_ROLE_API_BASE_URL}/${adminEmail}`);
        setIsAdmin(response.data.success && response.data.isAdmin);
      } catch { setIsAdmin(false); }
    };

    const fetchData = async () => {
      try {
        const res = await axios.get(API_URLS.ABOUT);
        if (res.data) {
          if (res.data.content) setContent(res.data.content);
          if (res.data.features) setFeatures(res.data.features);
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
    fetchData();
  }, []);

  /* ── CRUD handlers ── */
  const handleOpenAdd = () => {
    setEditingCard(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (card) => {
    setEditingCard(card);
    setModalOpen(true);
  };

  const saveToBackend = async (newData, newFeatures) => {
    try {
      await axios.post(API_URLS.ABOUT, {
        content: newData || content,
        features: newFeatures || features
      });
    } catch (err) {
      console.error("Error saving about data:", err);
      alert("Failed to save changes.");
    }
  };

  const handleSectionSave = async (values) => {
    const newData = { ...content, ...values };
    setContent(newData);
    await saveToBackend(newData, null);
  };

  const handleModalSave = async (formData) => {
    let newFeatures;
    if (editingCard) {
      newFeatures = features.map(f => f.id === editingCard.id ? { ...f, ...formData } : f);
    } else {
      newFeatures = [...features, { ...formData, id: Date.now() }];
    }
    setFeatures(newFeatures);
    setModalOpen(false);
    await saveToBackend(null, newFeatures);
  };

  const handleDelete = async (id) => {
    const newFeatures = features.filter(f => f.id !== id);
    setFeatures(newFeatures);
    setConfirmDeleteId(null);
    await saveToBackend(null, newFeatures);
  };

  if (loading) {
    return (
      <section id="about" className={`ab-section ${darkMode ? 'ab-dark' : 'ab-light'}`}>
        <div className="ab-container">
          <div className="ab-header" style={{ alignItems: 'center' }}>
            <div className="skeleton skeleton-pill" style={{ marginBottom: '1rem' }}></div>
            <div className="skeleton skeleton-title" style={{ width: '30%', marginBottom: '1rem' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
          </div>
          <div className="ab-layout">
            <div className="skeleton skeleton-card" style={{ flex: 1, height: 500 }}></div>
            <div className="ab-features-col" style={{ flex: 1.5 }}>
              <div className="ab-features-grid">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="skeleton skeleton-card" style={{ height: 240 }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className={`ab-section ${darkMode ? 'ab-dark' : 'ab-light'}`}>

      {/* Admin Section Editor (top-right) */}
      <SectionEditor
        isAdmin={isAdmin}
        darkMode={darkMode}
        accentColor="#6366f1"
        fields={[
          { key: 'badge', label: 'Badge Text', value: content.badge },
          { key: 'title', label: 'Title', value: content.title },
          { key: 'titleGrad', label: 'Title (Gradient)', value: content.titleGrad },
          { key: 'subtitle', label: 'Subtitle', value: content.subtitle, multiline: true },
          { key: 'bioName', label: 'Your Name', value: content.bioName },
          { key: 'bioRole', label: 'Your Role', value: content.bioRole },
          { key: 'storyParagraph1', label: 'Story – Para 1', value: content.storyParagraph1, multiline: true },
          { key: 'storyParagraph2', label: 'Story – Para 2', value: content.storyParagraph2, multiline: true },
        ]}
        onSave={handleSectionSave}
      />

      {/* Background orbs */}
      <div className="ab-orb ab-orb-1" />
      <div className="ab-orb ab-orb-2" />

      <div className="ab-container">

        {/* ── Header ── */}
        <div className="ab-header">
          <span className="ab-badge">{content.badge}</span>
          <h2 className="ab-title">
            {content.title} <span className="ab-title-grad">{content.titleGrad}</span>
          </h2>
          <p className={`ab-subtitle ${darkMode ? 'ab-muted-dark' : 'ab-muted-light'}`}>
            {content.subtitle}
          </p>
        </div>

        {/* ── Main layout ── */}
        <div className="ab-layout">

          {/* ─── Left: Bio card ─── */}
          <div className={`ab-bio-card ${darkMode ? 'ab-card-dark' : 'ab-card-light'}`}>
            <div className="ab-bio-strip" />
            <div className="ab-bio-top">
              <div className="ab-avatar-ring">
                <img
                  src="https://i.ibb.co/84xQ81qL/Untitled-design-5.png"
                  alt="Khalil Mejri"
                  className="ab-avatar-img"
                />
              </div>
              <div>
                <p className="ab-bio-name">{content.bioName}</p>
                <p className={`ab-bio-role ${darkMode ? 'ab-muted-dark' : 'ab-muted-light'}`}>{content.bioRole}</p>
              </div>
            </div>
            <h3 className="ab-story-title">My <span className="ab-story-grad">Story</span></h3>
            <p className={`ab-bio-p ${darkMode ? 'ab-muted-dark' : 'ab-muted-light'}`}>{content.storyParagraph1}</p>
            <p className={`ab-bio-p ${darkMode ? 'ab-muted-dark' : 'ab-muted-light'}`}>{content.storyParagraph2}</p>
            <div className="ab-stats">
              {stats.map((s, i) => (
                <div key={i} className={`ab-stat ${darkMode ? 'ab-stat-dark' : 'ab-stat-light'}`}>
                  <span className="ab-stat-val" style={{ backgroundImage: s.gradient }}>{s.value}</span>
                  <span className={`ab-stat-label ${darkMode ? 'ab-muted-dark' : 'ab-muted-light'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right: Feature cards ─── */}
          <div className="ab-features-col">

            {/* ── Admin "Add Card" button ── */}
            {isAdmin && (
              <button
                className={`ab-add-card-btn ${darkMode ? 'ab-add-card-dark' : 'ab-add-card-light'}`}
                onClick={handleOpenAdd}
              >
                <Plus size={16} />
                <span>Add Card</span>
              </button>
            )}

            {/* ── Grid ── */}
            <div className="ab-features-grid">
              {features.map((f, i) => {
                const hovered = hoveredFeature === i;
                const isConfirmingDelete = confirmDeleteId === f.id;

                return (
                  <div
                    key={f.id}
                    className={`ab-feat-card ${darkMode ? 'ab-card-dark' : 'ab-card-light'} ${hovered ? 'ab-feat-hovered' : ''}`}
                    style={{ '--feat-accent': f.accentColor }}
                    onMouseEnter={() => setHoveredFeature(i)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    {/* top accent line */}
                    <div
                      className="ab-feat-topline"
                      style={{ background: `linear-gradient(90deg, ${f.gradientFrom}, ${f.gradientTo})` }}
                    />

                    {/* ── Admin actions overlay (top-right of card) ── */}
                    {isAdmin && (
                      <div className="ab-card-admin-bar">
                        {isConfirmingDelete ? (
                          <>
                            <span className="ab-card-confirm-text">Delete?</span>
                            <button
                              className="ab-card-confirm-yes"
                              onClick={() => handleDelete(f.id)}
                              title="Confirm delete"
                            >✓</button>
                            <button
                              className="ab-card-confirm-no"
                              onClick={() => setConfirmDeleteId(null)}
                              title="Cancel"
                            >✕</button>
                          </>
                        ) : (
                          <>
                            <button
                              className="ab-card-edit-btn"
                              onClick={() => handleOpenEdit(f)}
                              title="Edit card"
                            ><Edit2 size={12} /></button>
                            <button
                              className="ab-card-delete-btn"
                              onClick={() => setConfirmDeleteId(f.id)}
                              title="Delete card"
                            ><Trash2 size={12} /></button>
                          </>
                        )}
                      </div>
                    )}

                    {/* Icon bubble */}
                    <div
                      className="ab-feat-icon-wrap"
                      style={{
                        background: `linear-gradient(135deg, ${f.gradientFrom}22, ${f.gradientTo}22)`,
                        border: `1px solid ${f.accentColor}44`,
                      }}
                    >
                      <span className="ab-feat-emoji">{f.emoji}</span>
                    </div>

                    <h4
                      className="ab-feat-title"
                      style={{ backgroundImage: `linear-gradient(135deg, ${f.gradientFrom}, ${f.gradientTo})` }}
                    >
                      {f.title}
                    </h4>
                    <p className={`ab-feat-desc ${darkMode ? 'ab-muted-dark' : 'ab-muted-light'}`}>
                      {f.description}
                    </p>

                    {/* glow */}
                    <div
                      className="ab-feat-glow"
                      style={{ background: `radial-gradient(ellipse at center, ${f.accentColor}18 0%, transparent 70%)` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Feature Card Modal ── */}
      {modalOpen && (
        <FeatureModal
          darkMode={darkMode}
          initialData={editingCard}
          onSave={handleModalSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
};

export default About;