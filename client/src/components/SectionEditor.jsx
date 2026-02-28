import React, { useState, useEffect } from 'react';
import { Edit3, X, Save, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * SectionEditor – A floating admin edit panel positioned at the top-right corner of a section.
 *
 * Props:
 *  - isAdmin   {boolean}  – Only renders when true
 *  - darkMode  {boolean}
 *  - fields    {Array}    – [{ key, label, value, multiline? }]
 *  - onSave    {Function} – called with updated values object: { key: newValue, … }
 *  - accentColor {string} – optional gradient start colour (default indigo)
 */
const SectionEditor = ({ isAdmin, darkMode, fields = [], onSave, accentColor = '#6366f1' }) => {
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState({});
    const [saved, setSaved] = useState(false);

    // Sync incoming fields → local state whenever they change
    useEffect(() => {
        const init = {};
        fields.forEach(f => { init[f.key] = f.value; });
        setValues(init);
    }, [fields.map(f => f.value).join('|')]);

    if (!isAdmin) return null;

    const handleChange = (key, val) => setValues(prev => ({ ...prev, [key]: val }));

    const handleSave = () => {
        if (onSave) onSave(values);
        setSaved(true);
        setTimeout(() => { setSaved(false); setOpen(false); }, 1200);
    };

    const handleCancel = () => {
        // reset
        const reset = {};
        fields.forEach(f => { reset[f.key] = f.value; });
        setValues(reset);
        setOpen(false);
    };

    return (
        <div className={`se-wrapper ${open ? 'se-wrapper-open' : ''}`}>
            {/* Toggle button */}
            <button
                className={`se-toggle-btn ${darkMode ? 'se-toggle-dark' : 'se-toggle-light'}`}
                style={{ '--se-accent': accentColor }}
                onClick={() => setOpen(prev => !prev)}
                title={open ? 'Close editor' : 'Edit section content'}
                aria-label="Toggle section editor"
            >
                {open ? <X size={15} /> : <Edit3 size={15} />}
                <span>{open ? 'Close' : 'Edit'}</span>
                {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {/* Slide-down panel */}
            {open && (
                <div className={`se-panel ${darkMode ? 'se-panel-dark' : 'se-panel-light'}`}
                    style={{ '--se-accent': accentColor }}
                >
                    <div className="se-panel-header">
                        <Edit3 size={14} style={{ color: accentColor }} />
                        <span className="se-panel-title">Edit Content</span>
                    </div>

                    <div className="se-fields">
                        {fields.map(f => (
                            <div key={f.key} className="se-field">
                                <label className={`se-label ${darkMode ? 'se-label-dark' : 'se-label-light'}`}>
                                    {f.label}
                                </label>
                                {f.multiline ? (
                                    <textarea
                                        className={`se-input se-textarea ${darkMode ? 'se-input-dark' : 'se-input-light'}`}
                                        value={values[f.key] ?? ''}
                                        onChange={e => handleChange(f.key, e.target.value)}
                                        rows={3}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className={`se-input ${darkMode ? 'se-input-dark' : 'se-input-light'}`}
                                        value={values[f.key] ?? ''}
                                        onChange={e => handleChange(f.key, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="se-actions">
                        <button className="se-cancel-btn" onClick={handleCancel}>
                            <X size={13} /> Cancel
                        </button>
                        <button
                            className={`se-save-btn ${saved ? 'se-saved' : ''}`}
                            style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
                            onClick={handleSave}
                        >
                            <Save size={13} />
                            {saved ? 'Saved ✓' : 'Save'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionEditor;
