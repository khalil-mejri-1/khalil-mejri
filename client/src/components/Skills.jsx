import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Save, ChevronDown } from 'lucide-react';
import { API_URLS } from '../apiConfig';
import SectionEditor from './SectionEditor';

const CHECK_ROLE_API_BASE_URL = API_URLS.CHECK_ROLE;

/* ── Preset colour palettes ── */
const COLOR_PRESETS = [
  { label: 'Blue–Cyan', accentColor: '#60a5fa', gradientFrom: '#3b82f6', gradientTo: '#06b6d4' },
  { label: 'Purple–Pink', accentColor: '#a78bfa', gradientFrom: '#8b5cf6', gradientTo: '#ec4899' },
  { label: 'Green–Lime', accentColor: '#34d399', gradientFrom: '#10b981', gradientTo: '#84cc16' },
  { label: 'Yellow–Orange', accentColor: '#fbbf24', gradientFrom: '#f59e0b', gradientTo: '#fb923c' },
  { label: 'Red–Yellow', accentColor: '#f87171', gradientFrom: '#ef4444', gradientTo: '#f59e0b' },
  { label: 'Indigo–Purple', accentColor: '#818cf8', gradientFrom: '#6366f1', gradientTo: '#a855f7' },
];

/* ── Popular skill icons list for suggestions ── */
const ICON_SUGGESTIONS = [
  { name: 'HTML5', icon: 'fab fa-html5', color: '#f97316' },
  { name: 'CSS3', icon: 'fab fa-css3-alt', color: '#3b82f6' },
  { name: 'JavaScript', icon: 'fab fa-js', color: '#fbbf24' },
  { name: 'React', icon: 'fab fa-react', color: '#22d3ee' },
  { name: 'Node.js', icon: 'fab fa-node-js', color: '#4ade80' },
  { name: 'Python', icon: 'fab fa-python', color: '#facc15' },
  { name: 'PHP', icon: 'fab fa-php', color: '#818cf8' },
  { name: 'Git', icon: 'fab fa-git-alt', color: '#fb923c' },
  { name: 'GitHub', icon: 'fab fa-github', color: '#e2e8f0' },
  { name: 'Docker', icon: 'fab fa-docker', color: '#38bdf8' },
  { name: 'AWS', icon: 'fab fa-aws', color: '#fb923c' },
  { name: 'Figma', icon: 'fab fa-figma', color: '#f472b6' },
  { name: 'Vue', icon: 'fab fa-vuejs', color: '#34d399' },
  { name: 'Angular', icon: 'fab fa-angular', color: '#f87171' },
  { name: 'Linux', icon: 'fab fa-linux', color: '#fbbf24' },
  { name: 'WordPress', icon: 'fab fa-wordpress', color: '#60a5fa' },
  { name: 'Database', icon: 'fas fa-database', color: '#67e8f9' },
  { name: 'MongoDB', icon: 'fas fa-leaf', color: '#86efac' },
  { name: 'Express', icon: 'fas fa-bolt', color: '#94a3b8' },
  { name: 'Tailwind', icon: 'fas fa-wind', color: '#2dd4bf' },
  { name: 'Server', icon: 'fas fa-server', color: '#a78bfa' },
  { name: 'Code', icon: 'fas fa-code', color: '#60a5fa' },
  { name: 'Terminal', icon: 'fas fa-terminal', color: '#34d399' },
  { name: 'Mobile', icon: 'fas fa-mobile-alt', color: '#f472b6' },
];

const EMPTY_CATEGORY = {
  title: '',
  emoji: '🛠️',
  accentColor: COLOR_PRESETS[0].accentColor,
  gradientFrom: COLOR_PRESETS[0].gradientFrom,
  gradientTo: COLOR_PRESETS[0].gradientTo,
  skills: [],
};

const EMPTY_SKILL = { name: '', icon: 'fas fa-code', color: '#60a5fa' };

const defaultSkillCategories = [
  {
    id: 1,
    title: 'Frontend',
    emoji: '🎨',
    accentColor: '#60a5fa',
    gradientFrom: '#3b82f6',
    gradientTo: '#06b6d4',
    skills: [
      { id: 11, name: 'HTML5', icon: 'fab fa-html5', color: '#f97316' },
      { id: 12, name: 'CSS3', icon: 'fab fa-css3-alt', color: '#3b82f6' },
      { id: 13, name: 'JavaScript', icon: 'fab fa-js', color: '#fbbf24' },
      { id: 14, name: 'React', icon: 'fab fa-react', color: '#22d3ee' },
      { id: 15, name: 'Tailwind', icon: 'fas fa-wind', color: '#2dd4bf' },
    ],
  },
  {
    id: 2,
    title: 'Backend',
    emoji: '⚙️',
    accentColor: '#a78bfa',
    gradientFrom: '#8b5cf6',
    gradientTo: '#ec4899',
    skills: [
      { id: 21, name: 'Node.js', icon: 'fab fa-node-js', color: '#4ade80' },
      { id: 22, name: 'Express', icon: 'fas fa-bolt', color: '#94a3b8' },
      { id: 23, name: 'PHP', icon: 'fab fa-php', color: '#818cf8' },
      { id: 24, name: 'MongoDB', icon: 'fas fa-leaf', color: '#86efac' },
      { id: 25, name: 'MySQL', icon: 'fas fa-database', color: '#67e8f9' },
    ],
  },
  {
    id: 3,
    title: 'Tools',
    emoji: '🛠️',
    accentColor: '#34d399',
    gradientFrom: '#10b981',
    gradientTo: '#84cc16',
    skills: [
      { id: 31, name: 'Git', icon: 'fab fa-git-alt', color: '#fb923c' },
      { id: 32, name: 'GitHub', icon: 'fab fa-github', color: '#e2e8f0' },
      { id: 33, name: 'Docker', icon: 'fab fa-docker', color: '#38bdf8' },
      { id: 34, name: 'Figma', icon: 'fab fa-figma', color: '#f472b6' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════
   Skill Row Editor (inside the category modal)
═══════════════════════════════════════════════════════ */
const SkillRow = ({ skill, darkMode, onChange, onDelete }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const pickSuggestion = (sug) => {
    onChange({ ...skill, name: sug.name, icon: sug.icon, color: sug.color });
    setShowSuggestions(false);
  };

  return (
    <div className="sk-skill-row">
      {/* Colour dot */}
      <input
        type="color"
        value={skill.color}
        onChange={e => onChange({ ...skill, color: e.target.value })}
        className="sk-skill-color-input"
        title="Skill colour"
      />

      {/* Name */}
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          value={skill.name}
          onChange={e => onChange({ ...skill, name: e.target.value })}
          placeholder="Skill name"
          className={`sk-modal-input ${darkMode ? 'sk-modal-input-dark' : 'sk-modal-input-light'}`}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
        />
        {showSuggestions && (
          <div className={`sk-suggestions ${darkMode ? 'sk-suggestions-dark' : 'sk-suggestions-light'}`}>
            {ICON_SUGGESTIONS.filter(s =>
              s.name.toLowerCase().includes(skill.name.toLowerCase())
            ).slice(0, 6).map(s => (
              <button
                key={s.name}
                type="button"
                className="sk-suggestion-item"
                onMouseDown={() => pickSuggestion(s)}
              >
                <i className={s.icon} style={{ color: s.color, marginRight: '0.4rem' }} />
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Icon class */}
      <input
        type="text"
        value={skill.icon}
        onChange={e => onChange({ ...skill, icon: e.target.value })}
        placeholder="fab fa-react"
        className={`sk-modal-input sk-icon-input ${darkMode ? 'sk-modal-input-dark' : 'sk-modal-input-light'}`}
      />

      {/* Preview */}
      <i className={`${skill.icon} sk-skill-preview-icon`} style={{ color: skill.color }} />

      {/* Delete skill */}
      <button type="button" className="sk-skill-delete-btn" onClick={onDelete} title="Remove skill">
        <X size={13} />
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   Category Modal (Add / Edit)
═══════════════════════════════════════════════════════ */
const CategoryModal = ({ darkMode, initialData, onSave, onClose }) => {
  const [form, setForm] = useState(
    initialData
      ? { ...initialData, skills: initialData.skills.map(s => ({ ...s })) }
      : { ...EMPTY_CATEGORY }
  );
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

  const addSkill = () =>
    setForm(prev => ({
      ...prev,
      skills: [...prev.skills, { ...EMPTY_SKILL, id: Date.now() }],
    }));

  const updateSkill = (idx, updated) =>
    setForm(prev => {
      const skills = [...prev.skills];
      skills[idx] = updated;
      return { ...prev, skills };
    });

  const deleteSkill = (idx) =>
    setForm(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx),
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <div className="sk-modal-overlay" onClick={onClose}>
      <div
        className={`sk-modal ${darkMode ? 'sk-modal-dark' : 'sk-modal-light'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sk-modal-header">
          <div className="sk-modal-title-row">
            <div
              className="sk-modal-icon"
              style={{ background: `linear-gradient(135deg, ${form.gradientFrom}, ${form.gradientTo})` }}
            >
              <span style={{ fontSize: '1.2rem' }}>{form.emoji}</span>
            </div>
            <h3 className="sk-modal-title">
              {initialData?.id ? 'Edit Category' : 'Add Category'}
            </h3>
          </div>
          <button className="sk-modal-close" onClick={onClose} type="button"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="sk-modal-form">

          {/* Emoji + Title */}
          <div className="sk-modal-row">
            <div className="sk-modal-field" style={{ flex: '0 0 88px' }}>
              <label className={`sk-modal-label ${darkMode ? 'sk-modal-label-dark' : 'sk-modal-label-light'}`}>Emoji</label>
              <input
                type="text"
                value={form.emoji}
                onChange={e => handleChange('emoji', e.target.value)}
                maxLength={4}
                placeholder="🛠️"
                className={`sk-modal-input sk-emoji-input ${darkMode ? 'sk-modal-input-dark' : 'sk-modal-input-light'}`}
              />
            </div>
            <div className="sk-modal-field" style={{ flex: 1 }}>
              <label className={`sk-modal-label ${darkMode ? 'sk-modal-label-dark' : 'sk-modal-label-light'}`}>Category Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                required
                placeholder="e.g. Frontend"
                className={`sk-modal-input ${darkMode ? 'sk-modal-input-dark' : 'sk-modal-input-light'}`}
              />
            </div>
          </div>

          {/* Colour presets */}
          <div className="sk-modal-field">
            <label className={`sk-modal-label ${darkMode ? 'sk-modal-label-dark' : 'sk-modal-label-light'}`}>Colour Theme</label>
            <div className="sk-color-presets">
              {COLOR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`sk-color-dot ${selectedPreset === idx ? 'sk-color-dot-selected' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${preset.gradientFrom}, ${preset.gradientTo})` }}
                  onClick={() => handlePreset(preset, idx)}
                  title={preset.label}
                />
              ))}
            </div>
            <div
              className="sk-color-preview"
              style={{ background: `linear-gradient(135deg, ${form.gradientFrom}, ${form.gradientTo})` }}
            />
          </div>

          {/* Skills list */}
          <div className="sk-modal-field">
            <div className="sk-skills-header">
              <label className={`sk-modal-label ${darkMode ? 'sk-modal-label-dark' : 'sk-modal-label-light'}`}>
                Skills ({form.skills.length})
              </label>
              <button
                type="button"
                className="sk-add-skill-btn"
                style={{ background: `linear-gradient(135deg, ${form.gradientFrom}, ${form.gradientTo})` }}
                onClick={addSkill}
              >
                <Plus size={12} /> Add Skill
              </button>
            </div>

            <div className="sk-skills-list">
              {form.skills.length === 0 && (
                <p className={`sk-no-skills ${darkMode ? 'sk-modal-muted-dark' : 'sk-modal-muted-light'}`}>
                  No skills yet — click "Add Skill" above.
                </p>
              )}
              {form.skills.map((skill, idx) => (
                <SkillRow
                  key={skill.id || idx}
                  skill={skill}
                  darkMode={darkMode}
                  onChange={(updated) => updateSkill(idx, updated)}
                  onDelete={() => deleteSkill(idx)}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="sk-modal-actions">
            <button type="button" className="sk-modal-cancel" onClick={onClose}>
              <X size={13} /> Cancel
            </button>
            <button
              type="submit"
              className="sk-modal-save"
              style={{ background: `linear-gradient(135deg, ${form.gradientFrom}, ${form.gradientTo})` }}
            >
              <Save size={13} />
              {initialData?.id ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   Main Skills Component
═══════════════════════════════════════════════════════ */
const Skills = ({ darkMode }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(defaultSkillCategories);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null); // null = add mode

  // Delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Section header content
  const [content, setContent] = useState({
    badge: 'My Expertise',
    title: 'Tech',
    titleGrad: 'Stack',
    subtitle: 'Crafting digital experiences with modern tools & technologies.',
  });

  useEffect(() => {
    const checkAdminRole = async () => {
      const adminEmail = localStorage.getItem('adminEmail');
      if (!adminEmail) return;
      try {
        const res = await axios.get(`${CHECK_ROLE_API_BASE_URL}/${adminEmail}`);
        setIsAdmin(res.data.success && res.data.isAdmin);
      } catch { setIsAdmin(false); }
    };

    const fetchData = async () => {
      try {
        const res = await axios.get(API_URLS.SKILLS);
        if (res.data) {
          if (res.data.content) setContent(res.data.content);
          if (res.data.categories) setCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Error fetching skills data:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
    fetchData();
  }, []);

  /* ── CRUD handlers ── */
  const saveToBackend = async (newContent, newCats) => {
    try {
      await axios.post(API_URLS.SKILLS, {
        content: newContent || content,
        categories: newCats || categories
      });
    } catch (err) {
      console.error("Error saving skills data:", err);
      alert("Failed to save changes.");
    }
  };

  const handleOpenAdd = () => { setEditingCat(null); setModalOpen(true); };
  const handleOpenEdit = (cat) => { setEditingCat(cat); setModalOpen(true); };

  const handleSectionSave = async (values) => {
    const newContent = { ...content, ...values };
    setContent(newContent);
    await saveToBackend(newContent, null);
  };

  const handleModalSave = async (formData) => {
    let newCats;
    if (editingCat) {
      newCats = categories.map(c => c.id === editingCat.id ? { ...c, ...formData } : c);
    } else {
      newCats = [...categories, { ...formData, id: Date.now() }];
    }
    setCategories(newCats);
    setModalOpen(false);
    await saveToBackend(null, newCats);
  };

  const handleDelete = async (id) => {
    const newCats = categories.filter(c => c.id !== id);
    setCategories(newCats);
    setConfirmDeleteId(null);
    await saveToBackend(null, newCats);
  };

  if (loading) {
    return (
      <section id="skills" className={`sk-section ${darkMode ? 'sk-dark' : 'sk-light'}`}>
        <div className="sk-container">
          <div className="sk-header" style={{ alignItems: 'center' }}>
            <div className="skeleton skeleton-pill" style={{ marginBottom: '1rem' }}></div>
            <div className="skeleton skeleton-title" style={{ width: '30%', marginBottom: '1rem' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
          </div>
          <div className="sk-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton skeleton-card" style={{ height: 350 }}></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className={`sk-section ${darkMode ? 'sk-dark' : 'sk-light'}`}>

      {/* Admin top-right editor */}
      <SectionEditor
        isAdmin={isAdmin}
        darkMode={darkMode}
        accentColor="#8b5cf6"
        fields={[
          { key: 'badge', label: 'Badge Text', value: content.badge },
          { key: 'title', label: 'Title', value: content.title },
          { key: 'titleGrad', label: 'Gradient Part', value: content.titleGrad },
          { key: 'subtitle', label: 'Subtitle', value: content.subtitle, multiline: true },
        ]}
        onSave={handleSectionSave}
      />

      {/* Background orbs */}
      <div className="sk-orb sk-orb-1" />
      <div className="sk-orb sk-orb-2" />
      <div className="sk-orb sk-orb-3" />

      <div className="sk-container">

        {/* Header */}
        <div className="sk-header">
          <span className="sk-badge">{content.badge}</span>
          <h2 className="sk-title">
            {content.title} <span className="sk-title-grad">{content.titleGrad}</span>
          </h2>
          <p className={`sk-subtitle ${darkMode ? 'sk-text-muted-dark' : 'sk-text-muted-light'}`}>
            {content.subtitle}
          </p>
        </div>

        {/* ── Admin "Add Category" button ── */}
        {isAdmin && (
          <div className="sk-admin-bar">
            <button
              className={`sk-add-cat-btn ${darkMode ? 'sk-add-cat-dark' : 'sk-add-cat-light'}`}
              onClick={handleOpenAdd}
            >
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </div>
        )}

        {/* Category Cards */}
        <div className="sk-grid">
          {categories.map((cat, ci) => {
            const isConfirmingDelete = confirmDeleteId === cat.id;
            return (
              <div
                key={cat.id}
                className={`sk-card ${hoveredCard === ci ? 'sk-card-hovered' : ''} ${darkMode ? 'sk-card-dark' : 'sk-card-light'}`}
                onMouseEnter={() => setHoveredCard(ci)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ '--card-accent': cat.accentColor }}
              >
                {/* Top gradient line */}
                <div
                  className="sk-card-topline"
                  style={{ background: `linear-gradient(90deg, ${cat.gradientFrom}, ${cat.gradientTo})` }}
                />

                {/* ── Admin action bar (top-right of card) ── */}
                {isAdmin && (
                  <div className="sk-card-admin-bar">
                    {isConfirmingDelete ? (
                      <>
                        <span className="sk-card-confirm-text">Delete?</span>
                        <button
                          className="sk-card-confirm-yes"
                          onClick={() => handleDelete(cat.id)}
                        >✓</button>
                        <button
                          className="sk-card-confirm-no"
                          onClick={() => setConfirmDeleteId(null)}
                        >✕</button>
                      </>
                    ) : (
                      <>
                        <button
                          className="sk-card-edit-btn"
                          onClick={() => handleOpenEdit(cat)}
                          title="Edit category"
                        ><Edit2 size={12} /></button>
                        <button
                          className="sk-card-delete-btn"
                          onClick={() => setConfirmDeleteId(cat.id)}
                          title="Delete category"
                        ><Trash2 size={12} /></button>
                      </>
                    )}
                  </div>
                )}

                {/* Card header */}
                <div className="sk-card-head">
                  <div
                    className="sk-cat-icon-wrap"
                    style={{
                      background: `linear-gradient(135deg, ${cat.gradientFrom}22, ${cat.gradientTo}22)`,
                      border: `1px solid ${cat.accentColor}44`,
                    }}
                  >
                    <span className="sk-cat-emoji">{cat.emoji}</span>
                  </div>
                  <h3
                    className="sk-cat-title"
                    style={{ backgroundImage: `linear-gradient(135deg, ${cat.gradientFrom}, ${cat.gradientTo})` }}
                  >
                    {cat.title}
                  </h3>
                </div>

                {/* Divider */}
                <div
                  className="sk-divider"
                  style={{ background: `linear-gradient(90deg, transparent, ${cat.accentColor}66, transparent)` }}
                />

                {/* Skills pills */}
                <div className="sk-pills">
                  {cat.skills.map((skill, si) => {
                    const key = `${ci}-${si}`;
                    const isHovered = hoveredSkill === key;
                    return (
                      <div
                        key={skill.id || si}
                        className={`sk-pill ${darkMode ? 'sk-pill-dark' : 'sk-pill-light'} ${isHovered ? 'sk-pill-hovered' : ''}`}
                        onMouseEnter={() => setHoveredSkill(key)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        style={isHovered ? {
                          background: `linear-gradient(135deg, ${skill.color}22, ${skill.color}11)`,
                          borderColor: `${skill.color}88`,
                          boxShadow: `0 0 12px ${skill.color}44`,
                        } : {}}
                      >
                        <i
                          className={`${skill.icon} sk-pill-icon`}
                          style={{ color: skill.color }}
                        />
                        <span className="sk-pill-name">{skill.name}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom glow */}
                <div
                  className="sk-card-glow"
                  style={{ background: `radial-gradient(ellipse at center, ${cat.accentColor}15 0%, transparent 70%)` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Modal */}
      {modalOpen && (
        <CategoryModal
          darkMode={darkMode}
          initialData={editingCat}
          onSave={handleModalSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
};

export default Skills;