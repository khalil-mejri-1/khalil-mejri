import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Mail, Phone, MapPin, Send, Github, Linkedin, Twitter,
  CheckCircle, Plus, Edit2, Trash2, X, Save, Instagram,
  Youtube, Facebook, Globe, Link
} from "lucide-react";
import { API_URLS } from "../apiConfig";
import SectionEditor from "./SectionEditor";

const CHECK_ROLE_API_BASE_URL = API_URLS.CHECK_ROLE;

/* ── Map icon name → Lucide component ── */
const SOCIAL_ICON_MAP = {
  Github: { component: Github, label: 'GitHub' },
  Linkedin: { component: Linkedin, label: 'LinkedIn' },
  Twitter: { component: Twitter, label: 'Twitter' },
  Instagram: { component: Instagram, label: 'Instagram' },
  Youtube: { component: Youtube, label: 'YouTube' },
  Facebook: { component: Facebook, label: 'Facebook' },
  Globe: { component: Globe, label: 'Website' },
  Link: { component: Link, label: 'Link' },
};

const SOCIAL_ICON_OPTIONS = Object.entries(SOCIAL_ICON_MAP).map(([key, val]) => ({
  key,
  label: val.label,
  Icon: val.component,
}));

/* ── Default data ── */
const defaultInfoItems = [
  {
    id: 1,
    icon: "Mail",
    label: "Email",
    value: "kmejri57@gmail.com",
    href: "mailto:kmejri57@gmail.com",
    grad: { from: "#6366f1", to: "#a855f7" },
  },
  {
    id: 2,
    icon: "Phone",
    label: "Phone",
    value: "+216 96 086 581",
    href: "tel:+21696086581",
    grad: { from: "#10b981", to: "#06b6d4" },
  },
  {
    id: 3,
    icon: "MapPin",
    label: "Location",
    value: "Tunis, Ben Arous, Fouchena",
    href: null,
    grad: { from: "#f59e0b", to: "#ec4899" },
  },
];

const defaultSocialLinks = [
  { id: 1, iconKey: "Github", href: "#", label: "GitHub", grad: { from: "#6366f1", to: "#a855f7" } },
  { id: 2, iconKey: "Linkedin", href: "#", label: "LinkedIn", grad: { from: "#3b82f6", to: "#06b6d4" } },
  { id: 3, iconKey: "Twitter", href: "#", label: "Twitter", grad: { from: "#06b6d4", to: "#10b981" } },
];

/* ── Helper to render an info icon ── */
const InfoIconComp = ({ name, size = 18 }) => {
  const map = { Mail, Phone, MapPin };
  const C = map[name] || Mail;
  return <C size={size} />;
};

/* ═══════════════════════════════════════════════════
   Info Item Edit Row
═══════════════════════════════════════════════════ */
const InfoItemRow = ({ item, darkMode, onChange, onDelete }) => {
  const presets = [
    { from: "#6366f1", to: "#a855f7" },
    { from: "#10b981", to: "#06b6d4" },
    { from: "#f59e0b", to: "#ec4899" },
    { from: "#3b82f6", to: "#06b6d4" },
    { from: "#ef4444", to: "#f59e0b" },
    { from: "#8b5cf6", to: "#ec4899" },
  ];

  return (
    <div className={`ct-info-edit-row ${darkMode ? 'ct-info-edit-dark' : 'ct-info-edit-light'}`}>
      {/* Colour strip */}
      <div
        className="ct-info-edit-strip"
        style={{ background: `linear-gradient(135deg, ${item.grad.from}, ${item.grad.to})` }}
      />

      <div className="ct-info-edit-body">
        {/* Label */}
        <div className="ct-info-edit-field">
          <label className={`ct-admin-label ${darkMode ? 'ct-admin-label-dark' : 'ct-admin-label-light'}`}>Label</label>
          <input
            type="text"
            value={item.label}
            onChange={e => onChange({ ...item, label: e.target.value })}
            placeholder="Email"
            className={`ct-admin-input ${darkMode ? 'ct-admin-input-dark' : 'ct-admin-input-light'}`}
          />
        </div>

        {/* Value */}
        <div className="ct-info-edit-field">
          <label className={`ct-admin-label ${darkMode ? 'ct-admin-label-dark' : 'ct-admin-label-light'}`}>Value</label>
          <input
            type="text"
            value={item.value}
            onChange={e => onChange({ ...item, value: e.target.value })}
            placeholder="your@email.com"
            className={`ct-admin-input ${darkMode ? 'ct-admin-input-dark' : 'ct-admin-input-light'}`}
          />
        </div>

        {/* Href */}
        <div className="ct-info-edit-field">
          <label className={`ct-admin-label ${darkMode ? 'ct-admin-label-dark' : 'ct-admin-label-light'}`}>Link (href)</label>
          <input
            type="text"
            value={item.href || ""}
            onChange={e => onChange({ ...item, href: e.target.value || null })}
            placeholder="mailto:… / tel:… / leave empty"
            className={`ct-admin-input ${darkMode ? 'ct-admin-input-dark' : 'ct-admin-input-light'}`}
          />
        </div>

        {/* Gradient preset */}
        <div className="ct-info-edit-field">
          <label className={`ct-admin-label ${darkMode ? 'ct-admin-label-dark' : 'ct-admin-label-light'}`}>Colour</label>
          <div className="ct-preset-row">
            {presets.map((p, i) => (
              <button
                key={i}
                type="button"
                className={`ct-preset-dot ${item.grad.from === p.from ? 'ct-preset-dot-sel' : ''}`}
                style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                onClick={() => onChange({ ...item, grad: p })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Delete button */}
      <button
        type="button"
        className="ct-info-edit-delete"
        onClick={onDelete}
        title="Remove this info item"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Social Link Edit Row
═══════════════════════════════════════════════════ */
const SocialLinkRow = ({ link, darkMode, onChange, onDelete }) => (
  <div className={`ct-social-edit-row ${darkMode ? 'ct-social-edit-dark' : 'ct-social-edit-light'}`}>
    {/* Icon picker */}
    <div className="ct-social-edit-field">
      <label className={`ct-admin-label ${darkMode ? 'ct-admin-label-dark' : 'ct-admin-label-light'}`}>Icon</label>
      <div className="ct-icon-picker">
        {SOCIAL_ICON_OPTIONS.map(opt => {
          const Ic = opt.Icon;
          return (
            <button
              key={opt.key}
              type="button"
              title={opt.label}
              className={`ct-icon-pick-btn ${link.iconKey === opt.key ? 'ct-icon-pick-sel' : ''} ${darkMode ? 'ct-icon-pick-dark' : 'ct-icon-pick-light'}`}
              onClick={() => onChange({ ...link, iconKey: opt.key, label: opt.label })}
            >
              <Ic size={15} />
            </button>
          );
        })}
      </div>
    </div>

    {/* Href */}
    <div className="ct-social-edit-field" style={{ flex: 1 }}>
      <label className={`ct-admin-label ${darkMode ? 'ct-admin-label-dark' : 'ct-admin-label-light'}`}>URL / Link</label>
      <input
        type="text"
        value={link.href}
        onChange={e => onChange({ ...link, href: e.target.value })}
        placeholder="https://github.com/username"
        className={`ct-admin-input ${darkMode ? 'ct-admin-input-dark' : 'ct-admin-input-light'}`}
      />
    </div>

    {/* Delete */}
    <button
      type="button"
      className="ct-social-edit-delete"
      onClick={onDelete}
      title="Remove this social link"
    >
      <Trash2 size={14} />
    </button>
  </div>
);

/* ═══════════════════════════════════════════════════
   Contact Admin Modal
═══════════════════════════════════════════════════ */
const ContactAdminModal = ({ darkMode, infoItems, socialLinks, onSave, onClose }) => {
  const [localInfo, setLocalInfo] = useState(infoItems.map(i => ({ ...i })));
  const [localSocial, setLocalSocial] = useState(socialLinks.map(s => ({ ...s })));

  const updateInfo = (idx, val) => setLocalInfo(prev => prev.map((it, i) => i === idx ? val : it));
  const deleteInfo = (idx) => setLocalInfo(prev => prev.filter((_, i) => i !== idx));
  const addInfo = () => setLocalInfo(prev => [...prev, {
    id: Date.now(), icon: "Mail", label: "New Item", value: "", href: null,
    grad: { from: "#6366f1", to: "#a855f7" },
  }]);

  const updateSocial = (idx, val) => setLocalSocial(prev => prev.map((s, i) => i === idx ? val : s));
  const deleteSocial = (idx) => setLocalSocial(prev => prev.filter((_, i) => i !== idx));
  const addSocial = () => setLocalSocial(prev => [...prev, {
    id: Date.now(), iconKey: "Globe", href: "#", label: "Link",
    grad: { from: "#6366f1", to: "#a855f7" },
  }]);

  const handleSave = () => {
    onSave({ infoItems: localInfo, socialLinks: localSocial });
    onClose();
  };

  return (
    <div className="ct-modal-overlay" onClick={onClose}>
      <div
        className={`ct-modal ${darkMode ? 'ct-modal-dark' : 'ct-modal-light'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ct-modal-header">
          <div className="ct-modal-title-row">
            <div className="ct-modal-icon-badge">
              <Edit2 size={16} />
            </div>
            <h3 className="ct-modal-title">Edit Contact Info</h3>
          </div>
          <button className="ct-modal-close" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="ct-modal-body">

          {/* ─── Contact Info Items ─── */}
          <div className="ct-modal-section">
            <div className="ct-modal-section-header">
              <span className={`ct-modal-section-title ${darkMode ? 'ct-modal-muted-dark' : 'ct-modal-muted-light'}`}>
                📋 Contact Info Items
              </span>
              <button
                type="button"
                className="ct-modal-add-btn"
                onClick={addInfo}
              >
                <Plus size={13} /> Add Item
              </button>
            </div>

            <div className="ct-modal-list">
              {localInfo.length === 0 && (
                <p className={`ct-modal-empty ${darkMode ? 'ct-modal-muted-dark' : 'ct-modal-muted-light'}`}>
                  No items — click "Add Item".
                </p>
              )}
              {localInfo.map((item, idx) => (
                <InfoItemRow
                  key={item.id}
                  item={item}
                  darkMode={darkMode}
                  onChange={(val) => updateInfo(idx, val)}
                  onDelete={() => deleteInfo(idx)}
                />
              ))}
            </div>
          </div>

          {/* ─── Social Links ─── */}
          <div className="ct-modal-section">
            <div className="ct-modal-section-header">
              <span className={`ct-modal-section-title ${darkMode ? 'ct-modal-muted-dark' : 'ct-modal-muted-light'}`}>
                🌐 Social Media Links
              </span>
              <button
                type="button"
                className="ct-modal-add-btn"
                onClick={addSocial}
              >
                <Plus size={13} /> Add Link
              </button>
            </div>

            <div className="ct-modal-list">
              {localSocial.length === 0 && (
                <p className={`ct-modal-empty ${darkMode ? 'ct-modal-muted-dark' : 'ct-modal-muted-light'}`}>
                  No social links — click "Add Link".
                </p>
              )}
              {localSocial.map((link, idx) => (
                <SocialLinkRow
                  key={link.id}
                  link={link}
                  darkMode={darkMode}
                  onChange={(val) => updateSocial(idx, val)}
                  onDelete={() => deleteSocial(idx)}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="ct-modal-footer">
          <button className="ct-modal-cancel" onClick={onClose} type="button">
            <X size={13} /> Cancel
          </button>
          <button className="ct-modal-save" onClick={handleSave} type="button">
            <Save size={13} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Main Contact Component
═══════════════════════════════════════════════════ */
const Contact = ({ darkMode }) => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Editable data
  const [infoItems, setInfoItems] = useState(defaultInfoItems);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Section header content
  const [content, setContent] = useState({
    badge: 'Contact',
    title: 'Get In',
    titleGrad: 'Touch',
    subtitle: "Ready to start your next project? Let's build something amazing together.",
    connectHeading: "Let's Connect",
    connectSubtitle: "I'm always open to new opportunities and exciting projects. Whether you have a question or just want to say hi — reach out!",
    sendHeading: 'Send a Message',
    sendBtn: 'Send Message',
    followLabel: 'Follow Me',
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
        const res = await axios.get(API_URLS.CONTACT);
        if (res.data) {
          if (res.data.content) setContent(res.data.content);
          if (res.data.infoItems) setInfoItems(res.data.infoItems);
          if (res.data.socialLinks) setSocialLinks(res.data.socialLinks);
        }
      } catch (err) {
        console.error("Error fetching contact data:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
    fetchData();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const saveToBackend = async (newContent, newInfos, newSocials) => {
    try {
      await axios.post(API_URLS.CONTACT, {
        content: newContent || content,
        infoItems: newInfos || infoItems,
        socialLinks: newSocials || socialLinks
      });
    } catch (err) {
      console.error("Error saving contact data:", err);
      alert("Failed to save changes.");
    }
  };

  const handleSectionSave = async (values) => {
    const newContent = { ...content, ...values };
    setContent(newContent);
    await saveToBackend(newContent, null, null);
  };

  const handleAdminSave = async ({ infoItems: newInfo, socialLinks: newSocial }) => {
    setInfoItems(newInfo);
    setSocialLinks(newSocial);
    await saveToBackend(null, newInfo, newSocial);
  };

  if (loading) {
    return (
      <section id="contact" className={`ct-section ${darkMode ? "ct-dark" : "ct-light"}`}>
        <div className="ct-container">
          <div className="ct-header" style={{ alignItems: 'center' }}>
            <div className="skeleton skeleton-pill" style={{ marginBottom: '1rem' }}></div>
            <div className="skeleton skeleton-title" style={{ width: '30%', marginBottom: '1rem' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
          </div>
          <div className="ct-grid">
            <div className="skeleton skeleton-card" style={{ height: 500 }}></div>
            <div className="skeleton skeleton-card" style={{ height: 500 }}></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className={`ct-section ${darkMode ? "ct-dark" : "ct-light"}`}>

      {/* ── Section text editor (top-right) ── */}
      <SectionEditor
        isAdmin={isAdmin}
        darkMode={darkMode}
        accentColor="#06b6d4"
        fields={[
          { key: 'badge', label: 'Badge Text', value: content.badge },
          { key: 'title', label: 'Title', value: content.title },
          { key: 'titleGrad', label: 'Gradient Part', value: content.titleGrad },
          { key: 'subtitle', label: 'Subtitle', value: content.subtitle, multiline: true },
          { key: 'connectHeading', label: 'Card 1 Heading', value: content.connectHeading },
          { key: 'connectSubtitle', label: 'Card 1 Subtext', value: content.connectSubtitle, multiline: true },
          { key: 'sendHeading', label: 'Form Heading', value: content.sendHeading },
          { key: 'sendBtn', label: 'Send Button', value: content.sendBtn },
          { key: 'followLabel', label: '"Follow Me" Text', value: content.followLabel },
        ]}
        onSave={handleSectionSave}
      />

      {/* ── Admin "Edit Contact Info" button ── */}
      {isAdmin && (
        <button
          className={`ct-admin-edit-info-btn ${darkMode ? 'ct-admin-edit-dark' : 'ct-admin-edit-light'}`}
          onClick={() => setAdminModalOpen(true)}
          title="Edit contact info & social links"
        >
          <Edit2 size={14} />
          <span>Edit Info & Socials</span>
        </button>
      )}

      {/* Background orbs */}
      <div className="ct-orb ct-orb-1" />
      <div className="ct-orb ct-orb-2" />

      <div className="ct-container">

        {/* ── Header ── */}
        <div className="ct-header">
          <span className="ct-badge">{content.badge}</span>
          <h2 className="ct-title">
            {content.title} <span className="ct-title-grad">{content.titleGrad}</span>
          </h2>
          <p className={`ct-subtitle ${darkMode ? "ct-muted-dark" : "ct-muted-light"}`}>
            {content.subtitle}
          </p>
        </div>

        <div className="ct-grid">

          {/* ── Info Card ── */}
          <div className={`ct-card ${darkMode ? "ct-card-dark" : "ct-card-light"}`}>
            <div className="ct-card-topline" style={{ background: "linear-gradient(90deg,#6366f1,#a855f7,#06b6d4)" }} />

            <h3 className="ct-card-heading">{content.connectHeading}</h3>
            <p className={`ct-card-sub ${darkMode ? "ct-muted-dark" : "ct-muted-light"}`}>
              {content.connectSubtitle}
            </p>

            {/* Info items – rendered dynamically */}
            <div className="ct-info-list">
              {infoItems.map((item) => (
                <div key={item.id} className="ct-info-item">
                  <div
                    className="ct-info-icon"
                    style={{ background: `linear-gradient(135deg, ${item.grad.from}, ${item.grad.to})` }}
                  >
                    <InfoIconComp name={item.icon} size={18} />
                  </div>
                  <div className="ct-info-text">
                    <span className="ct-info-label">{item.label}</span>
                    {item.href
                      ? <a href={item.href} className={`ct-info-value ct-info-link ${darkMode ? "ct-muted-dark" : "ct-muted-light"}`}>{item.value}</a>
                      : <span className={`ct-info-value ${darkMode ? "ct-muted-dark" : "ct-muted-light"}`}>{item.value}</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Social links – rendered dynamically */}
            <div className={`ct-social-wrap ${darkMode ? "ct-divider-dark" : "ct-divider-light"}`}>
              <h4 className={`ct-social-title ${darkMode ? "ct-muted-dark" : "ct-muted-light"}`}>{content.followLabel}</h4>
              <div className="ct-social-row">
                {socialLinks.map((s) => {
                  const iconDef = SOCIAL_ICON_MAP[s.iconKey];
                  const IconComp = iconDef ? iconDef.component : Globe;

                  // Ensure absolute URL
                  const url = s.href && (s.href.startsWith('http') || s.href.startsWith('mailto:'))
                    ? s.href
                    : `https://${s.href}`;

                  return (
                    <a
                      key={s.id}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className={`ct-social-btn ${darkMode ? "ct-social-dark" : "ct-social-light"}`}
                      style={{ "--ct-from": s.grad?.from || "#6366f1", "--ct-to": s.grad?.to || "#a855f7" }}
                    >
                      <IconComp size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="ct-card-glow" style={{ background: "radial-gradient(ellipse at bottom, #6366f118 0%, transparent 70%)" }} />
          </div>

          {/* ── Form Card ── */}
          <div className={`ct-card ${darkMode ? "ct-card-dark" : "ct-card-light"}`}>
            <div className="ct-card-topline" style={{ background: "linear-gradient(90deg,#10b981,#06b6d4,#a855f7)" }} />

            {sent ? (
              <div className="ct-success">
                <CheckCircle size={48} className="ct-success-icon" />
                <h3 className="ct-success-title">Message Sent!</h3>
                <p className={darkMode ? "ct-muted-dark" : "ct-muted-light"}>
                  Thanks! I'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <>
                <h3 className="ct-card-heading">{content.sendHeading}</h3>
                <form onSubmit={handleSubmit} className="ct-form">
                  <div className="ct-form-row">
                    {[
                      { name: "name", type: "text", label: "Full Name", placeholder: "Your name" },
                      { name: "email", type: "email", label: "Email Address", placeholder: "your@email.com" },
                    ].map((f) => (
                      <div key={f.name} className="ct-field">
                        <label className={`ct-label ${darkMode ? "ct-label-dark" : "ct-label-light"}`}>{f.label}</label>
                        <input
                          type={f.type}
                          name={f.name}
                          value={formData[f.name]}
                          onChange={handleChange}
                          onFocus={() => setFocused(f.name)}
                          onBlur={() => setFocused(null)}
                          required
                          placeholder={f.placeholder}
                          className={`ct-input ${darkMode ? "ct-input-dark" : "ct-input-light"} ${focused === f.name ? "ct-input-focused" : ""}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="ct-field">
                    <label className={`ct-label ${darkMode ? "ct-label-dark" : "ct-label-light"}`}>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocused("subject")}
                      onBlur={() => setFocused(null)}
                      required
                      placeholder="Project inquiry"
                      className={`ct-input ${darkMode ? "ct-input-dark" : "ct-input-light"} ${focused === "subject" ? "ct-input-focused" : ""}`}
                    />
                  </div>

                  <div className="ct-field">
                    <label className={`ct-label ${darkMode ? "ct-label-dark" : "ct-label-light"}`}>Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      required
                      rows="5"
                      placeholder="Tell me about your project..."
                      className={`ct-input ct-textarea ${darkMode ? "ct-input-dark" : "ct-input-light"} ${focused === "message" ? "ct-input-focused" : ""}`}
                    />
                  </div>

                  <button type="submit" className="ct-submit">
                    <span>{content.sendBtn}</span>
                    <Send size={16} className="ct-send-icon" />
                  </button>
                </form>
              </>
            )}

            <div className="ct-card-glow" style={{ background: "radial-gradient(ellipse at bottom, #10b98118 0%, transparent 70%)" }} />
          </div>

        </div>
      </div>

      {/* ── Contact Admin Modal ── */}
      {adminModalOpen && (
        <ContactAdminModal
          darkMode={darkMode}
          infoItems={infoItems}
          socialLinks={socialLinks}
          onSave={handleAdminSave}
          onClose={() => setAdminModalOpen(false)}
        />
      )}
    </section>
  );
};

export default Contact;