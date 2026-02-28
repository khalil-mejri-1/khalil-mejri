import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Github, Linkedin, Twitter, Instagram,
    Youtube, Facebook, Globe, Link, Save, X, Share2
} from 'lucide-react';

const ICON_OPTIONS = [
    { id: 'github', icon: <Github size={18} /> },
    { id: 'linkedin', icon: <Linkedin size={18} /> },
    { id: 'twitter', icon: <Twitter size={18} /> },
    { id: 'instagram', icon: <Instagram size={18} /> },
    { id: 'youtube', icon: <Youtube size={18} /> },
    { id: 'facebook', icon: <Facebook size={18} /> },
    { id: 'globe', icon: <Globe size={18} /> },
    { id: 'link', icon: <Link size={18} /> },
];

const SocialLinksEditor = ({ isAdmin, darkMode, initialLinks = [], onSave, accentColor = '#8b5cf6' }) => {
    const [open, setOpen] = useState(false);
    const [links, setLinks] = useState([]);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setLinks(initialLinks.length > 0 ? initialLinks : []);
    }, [JSON.stringify(initialLinks)]);

    if (!isAdmin) return null;

    const handleAddLink = () => {
        setLinks([...links, { id: Date.now(), platform: 'github', url: '' }]);
    };

    const handleRemoveLink = (id) => {
        setLinks(links.filter(link => link.id !== id));
    };

    const handleChangePlatform = (index, platform) => {
        const newLinks = [...links];
        newLinks[index].platform = platform;
        setLinks(newLinks);
    };

    const handleChangeUrl = (index, url) => {
        const newLinks = [...links];
        newLinks[index].url = url;
        setLinks(newLinks);
    };

    const handleSave = () => {
        onSave(links);
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            setOpen(false);
        }, 1500);
    };

    return (
        <div className="se-wrapper">
            <button
                className={`se-toggle-btn ${darkMode ? 'se-toggle-dark' : 'se-toggle-light'}`}
                style={{ '--se-accent': accentColor }}
                onClick={() => setOpen(!open)}
            >
                <Share2 size={15} />
                <span>Social Links</span>
            </button>

            {open && (
                <div className={`se-panel ${darkMode ? 'se-panel-dark' : 'se-panel-light'} social-editor-panel`}
                    style={{ width: '400px', maxWidth: '90vw' }}>
                    <div className="se-panel-header" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Globe size={16} />
                            <span className="se-panel-title">SOCIAL MEDIA LINKS</span>
                        </div>
                        <button
                            onClick={handleAddLink}
                            className="add-link-btn"
                            style={{ background: `linear-gradient(135deg, ${accentColor}, #3b82f6)` }}
                        >
                            <Plus size={14} /> Add Link
                        </button>
                    </div>

                    <div className="social-links-list">
                        {links.length === 0 ? (
                            <p className="no-links-text">No social links added yet.</p>
                        ) : (
                            links.map((link, index) => (
                                <div key={link.id || index} className={`social-link-item ${darkMode ? 'item-dark' : 'item-light'}`}>
                                    <div className="link-item-header">
                                        <span className="field-label">ICON</span>
                                        <span className="field-label">URL / LINK</span>
                                    </div>
                                    <div className="link-item-controls">
                                        <div className="icon-selector">
                                            {ICON_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    className={`icon-btn ${link.platform === opt.id ? 'active' : ''}`}
                                                    onClick={() => handleChangePlatform(index, opt.id)}
                                                    style={{ '--active-color': accentColor }}
                                                >
                                                    {opt.icon}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="url-input-wrap">
                                            <input
                                                type="text"
                                                placeholder="#"
                                                value={link.url}
                                                onChange={(e) => handleChangeUrl(index, e.target.value)}
                                                className={`url-input ${darkMode ? 'input-dark' : 'input-light'}`}
                                            />
                                            <button
                                                onClick={() => handleRemoveLink(link.id)}
                                                className="delete-link-btn"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="se-actions">
                        <button className="se-cancel-btn" onClick={() => setOpen(false)}>
                            <X size={13} /> Cancel
                        </button>
                        <button
                            className={`se-save-btn ${saved ? 'se-saved' : ''}`}
                            style={{ background: `linear-gradient(135deg, ${accentColor}, #3b82f6)` }}
                            onClick={handleSave}
                        >
                            <Save size={13} />
                            {saved ? 'Saved ✓' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialLinksEditor;
