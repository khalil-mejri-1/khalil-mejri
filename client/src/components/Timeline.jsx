import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Calendar, MapPin, Award, Briefcase, GraduationCap } from 'lucide-react';
import { API_URLS } from '../apiConfig';
import SectionEditor from './SectionEditor';

const CHECK_ROLE_API_BASE_URL = API_URLS.CHECK_ROLE;

const timelineData = [
    {
        type: 'education',
        title: 'Software Engineering & Information Systems Degree',
        company: 'FSTSBZ — Faculté des Sciences et Techniques de Sidi Bouzid',
        location: 'Sidi Bouzid, Tunisia',
        period: '2023 – 2026 (Expected)',
        description: 'Focused on advanced software engineering principles, database systems (MongoDB), and modern web application development. Graduated with a Very Good (Très Bien) distinction.',
        achievements: [
            'Academic Honor: Graduated with "Very Good" (Très Bien) distinction in Software Engineering.',
            'Participated in 3 Coding Competitions (Hackathons) focused on Cybersecurity within 24-hour timeframes.',
            'Developed strong Effective Time Management skills under high pressure to deliver integrated projects.',
        ],
        accentColor: '#6366f1',
        gradientFrom: '#6366f1',
        gradientTo: '#06b6d4',
    },
    {
        type: 'work',
        title: 'Lead Full Stack Developer & AI Integrator (Freelance)',
        company: '10+ Major Projects (Self-Developed)',
        location: 'Remote / Tunisia',
        period: '2023 – Present',
        description: 'Designed, developed, and deployed over 10 full-stack applications using the MERN Stack, applying best practices across the full software development lifecycle (SDLC).',
        achievements: [
            'CI/CD: Established pipelines using GitHub, Vercel & Firebase for automated rapid deployment.',
            'AI: Built a custom TensorFlow model for image background removal (10k images, 95% accuracy), distributed via Docker.',
            'Real-Time: Implemented robust real-time notification architecture for mobile users and admins.',
        ],
        accentColor: '#10b981',
        gradientFrom: '#10b981',
        gradientTo: '#84cc16',
    },
    {
        type: 'education',
        title: 'Baccalaureate Diploma (High School Graduation)',
        company: 'High School',
        location: 'Tunisia',
        period: '2022',
        description: 'Successfully obtained the Baccalaureate Diploma, providing a strong foundation for higher technical studies in computer science.',
        achievements: [
            'Successfully passed the Baccalaureate exam.',
            'Prepared for higher technical studies in engineering.',
        ],
        accentColor: '#a855f7',
        gradientFrom: '#a855f7',
        gradientTo: '#ec4899',
    },
];

const Timeline = ({ darkMode }) => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState(timelineData); // fallback to local

    const [content, setContent] = useState({
        badge: 'My Path',
        title: 'My',
        titleGrad: 'Journey',
        subtitle: 'Professional and educational milestones that shaped who I am.',
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
                const res = await axios.get(API_URLS.TIMELINE);
                if (res.data) {
                    if (res.data.content) setContent(res.data.content);
                    if (res.data.items) setItems(res.data.items);
                }
            } catch (err) {
                console.error("Error fetching timeline data:", err);
            } finally {
                setLoading(false);
            }
        };

        checkAdminRole();
        fetchData();
    }, []);

    const handleSave = async (values) => {
        try {
            const newContent = { ...content, ...values };
            setContent(newContent);
            await axios.post(API_URLS.TIMELINE, { content: newContent, items });
        } catch (err) {
            console.error("Error saving timeline meta:", err);
            alert("Failed to save changes.");
        }
    };

    if (loading) {
        return (
            <section id="timeline" className={`tj-section ${darkMode ? 'tj-dark' : 'tj-light'}`}>
                <div className="tj-container">
                    <div className="tj-header" style={{ alignItems: 'center' }}>
                        <div className="skeleton skeleton-pill" style={{ marginBottom: '1rem' }}></div>
                        <div className="skeleton skeleton-title" style={{ width: '30%', marginBottom: '1rem' }}></div>
                        <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
                    </div>
                    <div className="tj-timeline">
                        <div className="tj-line" style={{ left: '50%' }} />
                        {[1, 2].map(i => (
                            <div key={i} className={`tj-item ${i % 2 !== 0 ? 'tj-item-left' : 'tj-item-right'}`}>
                                <div className="skeleton skeleton-card" style={{ height: 300 }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="timeline" className={`tj-section ${darkMode ? 'tj-dark' : 'tj-light'}`}>

            {/* Admin Section Editor */}
            <SectionEditor
                isAdmin={isAdmin}
                darkMode={darkMode}
                accentColor="#a855f7"
                fields={[
                    { key: 'badge', label: 'Badge Text', value: content.badge },
                    { key: 'title', label: 'Title', value: content.title },
                    { key: 'titleGrad', label: 'Title (Gradient Part)', value: content.titleGrad },
                    { key: 'subtitle', label: 'Subtitle', value: content.subtitle, multiline: true },
                ]}
                onSave={handleSave}
            />

            {/* Background orbs */}
            <div className="tj-orb tj-orb-1" />
            <div className="tj-orb tj-orb-2" />

            <div className="tj-container">

                {/* Header */}
                <div className="tj-header">
                    <span className="tj-badge">{content.badge}</span>
                    <h2 className="tj-title">
                        {content.title} <span className="tj-title-grad">{content.titleGrad}</span>
                    </h2>
                    <p className={`tj-subtitle ${darkMode ? 'tj-muted-dark' : 'tj-muted-light'}`}>
                        {content.subtitle}
                    </p>
                </div>

                {/* Timeline */}
                <div className="tj-timeline">
                    {/* Vertical line */}
                    <div className="tj-line" />

                    {items.map((item, index) => {
                        const isWork = item.type === 'work';
                        const isEven = index % 2 === 0;
                        const hovered = hoveredCard === index;

                        return (
                            <div
                                key={index}
                                className={`tj-item ${isEven ? 'tj-item-left' : 'tj-item-right'}`}
                            >
                                {/* Card */}
                                <div
                                    className={`tj-card ${darkMode ? 'tj-card-dark' : 'tj-card-light'} ${hovered ? 'tj-card-hovered' : ''}`}
                                    style={{ '--tj-from': item.gradientFrom, '--tj-to': item.gradientTo }}
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    {/* Top accent line */}
                                    <div className="tj-card-topline" style={{ background: `linear-gradient(90deg, ${item.gradientFrom}, ${item.gradientTo})` }} />

                                    {/* Badge */}
                                    <div
                                        className="tj-type-badge"
                                        style={{
                                            background: `linear-gradient(135deg, ${item.gradientFrom}22, ${item.gradientTo}22)`,
                                            border: `1px solid ${item.accentColor}44`,
                                            color: item.accentColor,
                                        }}
                                    >
                                        {isWork
                                            ? <Briefcase size={11} style={{ marginRight: '0.3rem' }} />
                                            : <GraduationCap size={11} style={{ marginRight: '0.3rem' }} />
                                        }
                                        {isWork ? 'Work Experience' : 'Education'}
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="tj-card-title"
                                        style={{ backgroundImage: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})` }}
                                    >
                                        {item.title}
                                    </h3>

                                    {/* Company */}
                                    <div className="tj-card-company" style={{ color: item.accentColor }}>
                                        {item.company}
                                    </div>

                                    {/* Details */}
                                    <div className="tj-details">
                                        <div className="tj-detail-item">
                                            <Calendar size={13} className="tj-detail-icon" />
                                            <span>{item.period}</span>
                                        </div>
                                        <div className="tj-detail-item">
                                            <MapPin size={13} className="tj-detail-icon" />
                                            <span>{item.location}</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className={`tj-desc ${darkMode ? 'tj-muted-dark' : 'tj-muted-light'}`}>
                                        {item.description}
                                    </p>

                                    {/* Achievements */}
                                    <div
                                        className={`tj-achievements ${darkMode ? 'tj-ach-dark' : 'tj-ach-light'}`}
                                        style={{ borderColor: `${item.accentColor}30` }}
                                    >
                                        <h4 className="tj-ach-title">
                                            <Award size={13} style={{ color: item.accentColor, marginRight: '0.35rem', flexShrink: 0 }} />
                                            Key Achievements
                                        </h4>
                                        <ul className="tj-ach-list">
                                            {item.achievements.map((ach, ai) => (
                                                <li key={ai} className="tj-ach-item">
                                                    <span className="tj-ach-dot" style={{ background: item.accentColor }} />
                                                    <span className={darkMode ? 'tj-muted-dark' : 'tj-muted-light'}>{ach}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Bottom glow */}
                                    <div className="tj-card-glow"
                                        style={{ background: `radial-gradient(ellipse at bottom, ${item.accentColor}18 0%, transparent 70%)` }}
                                    />
                                </div>

                                {/* Center dot */}
                                <div
                                    className="tj-dot"
                                    style={{
                                        background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})`,
                                        boxShadow: `0 0 0 4px ${item.accentColor}33, 0 0 16px ${item.accentColor}44`,
                                    }}
                                >
                                    {isWork
                                        ? <Briefcase size={12} color="#fff" />
                                        : <GraduationCap size={12} color="#fff" />
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

Timeline.propTypes = { darkMode: PropTypes.bool.isRequired };
export default Timeline;