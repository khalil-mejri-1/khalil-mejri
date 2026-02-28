import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ExternalLink, Github, Eye, Plus, Edit, Trash2, Sparkles } from 'lucide-react';
import AddProject from './addProejct';
import { API_URLS } from '../apiConfig';
import SectionEditor from './SectionEditor';

const PROJECTS_API_URL = API_URLS.PROJECTS;
const CHECK_ROLE_API_BASE_URL = API_URLS.CHECK_ROLE;

/* Colour palette cycling for tech tags */
const TAG_PALETTES = [
    { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)', color: '#818cf8' },
    { bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.3)', color: '#22d3ee' },
    { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#34d399' },
    { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', color: '#fbbf24' },
    { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)', color: '#f472b6' },
    { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)', color: '#a78bfa' },
];

/* Accent colour per card (cycles) */
const CARD_ACCENTS = [
    { from: '#6366f1', to: '#a855f7' },
    { from: '#3b82f6', to: '#06b6d4' },
    { from: '#10b981', to: '#84cc16' },
    { from: '#f59e0b', to: '#fb923c' },
    { from: '#ec4899', to: '#8b5cf6' },
    { from: '#06b6d4', to: '#6366f1' },
];

const Projects = ({ darkMode }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminCheckLoading, setIsAdminCheckLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    // Editable section header content
    const [content, setContent] = useState({
        badge: 'My Work',
        title: 'Featured',
        titleGrad: 'Projects',
        subtitle: 'A showcase of my recent work — from concept to deployment.',
        viewAllBtn: 'View All Projects',
    });

    const fetchProjects = useCallback(async () => {
        try {
            const response = await axios.get(PROJECTS_API_URL);
            const fetchedData = response.data;
            if (Array.isArray(fetchedData)) {
                setProjects(fetchedData);
            } else if (fetchedData.projects && Array.isArray(fetchedData.projects)) {
                setProjects(fetchedData.projects);
            } else {
                setError('Invalid retrieved projects data structure.');
                setProjects([]);
            }
        } catch (err) {
            setError('Failed to connect to the server or fetch projects.');
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleModal = () => {
        setIsModalOpen(prev => {
            if (prev) setProjectToEdit(null);
            return !prev;
        });
    };
    const handleEditProject = (project) => { setProjectToEdit(project); setIsModalOpen(true); };
    const handleDeleteProject = async (projectId, projectTitle) => {
        if (window.confirm(`Are you sure you want to delete: ${projectTitle}?`)) {
            try {
                await axios.delete(`${PROJECTS_API_URL}/${projectId}`);
                setProjects(prev => prev.filter(p => p._id !== projectId));
                alert(`"${projectTitle}" deleted successfully.`);
            } catch (err) {
                alert(`Failed to delete: ${err.response?.data?.message || 'Server error'}`);
            }
        }
    };

    useEffect(() => {
        const checkAdminRole = async () => {
            const adminEmail = localStorage.getItem('adminEmail');
            if (!adminEmail) { setIsAdmin(false); setIsAdminCheckLoading(false); return; }
            try {
                const response = await axios.get(`${CHECK_ROLE_API_BASE_URL}/${adminEmail}`);
                setIsAdmin(response.data.success && response.data.isAdmin);
            } catch { setIsAdmin(false); }
            finally { setIsAdminCheckLoading(false); }
        };

        const fetchMeta = async () => {
            try {
                const res = await axios.get(API_URLS.PROJECTS_META);
                if (res.data) setContent(res.data);
            } catch (err) {
                console.error("Error fetching projects meta:", err);
            }
        };

        fetchProjects();
        checkAdminRole();
        fetchMeta();
    }, [fetchProjects]);

    const handleSectionSave = async (values) => {
        try {
            const newContent = { ...content, ...values };
            setContent(newContent);
            await axios.post(API_URLS.PROJECTS_META, newContent);
        } catch (err) {
            console.error("Error saving projects meta:", err);
            alert("Failed to save section changes.");
        }
    };

    /* ── Loading / Error states ── */
    if (loading || isAdminCheckLoading) {
        return (
            <section id="projects" className={`pr-section ${darkMode ? 'pr-dark' : 'pr-light'}`}>
                <div className="pr-container">
                    <div className="pr-header" style={{ alignItems: 'center' }}>
                        <div className="skeleton skeleton-pill" style={{ marginBottom: '1rem' }}></div>
                        <div className="skeleton skeleton-title" style={{ width: '30%', marginBottom: '1rem' }}></div>
                        <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
                    </div>
                    <div className="pr-grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton skeleton-card" style={{ height: 450 }}></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="projects" className={`pr-section ${darkMode ? 'pr-dark' : 'pr-light'}`}>
                <div className="pr-container pr-center">
                    <p className="pr-error-text">⚠️ {error}</p>
                    <p className={`${darkMode ? 'pr-muted-dark' : 'pr-muted-light'}`}>Please check the API connection.</p>
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className={`pr-section ${darkMode ? 'pr-dark' : 'pr-light'}`}>

            {/* Admin Section Editor */}
            <SectionEditor
                isAdmin={isAdmin}
                darkMode={darkMode}
                accentColor="#10b981"
                fields={[
                    { key: 'badge', label: 'Badge Text', value: content.badge },
                    { key: 'title', label: 'Title', value: content.title },
                    { key: 'titleGrad', label: 'Title (Gradient Part)', value: content.titleGrad },
                    { key: 'subtitle', label: 'Subtitle', value: content.subtitle, multiline: true },
                    { key: 'viewAllBtn', label: '"View All" Button Text', value: content.viewAllBtn },
                ]}
                onSave={handleSectionSave}
            />

            {/* Background orbs */}
            <div className="pr-orb pr-orb-1" />
            <div className="pr-orb pr-orb-2" />
            <div className="pr-orb pr-orb-3" />

            <div className="pr-container">

                {/* ── Header ── */}
                <div className="pr-header">
                    <span className="pr-badge">{content.badge}</span>
                    <h2 className="pr-title">
                        {content.title} <span className="pr-title-grad">{content.titleGrad}</span>
                    </h2>
                    <p className={`pr-subtitle ${darkMode ? 'pr-muted-dark' : 'pr-muted-light'}`}>
                        {content.subtitle}
                    </p>
                </div>

                {/* ── Admin Add Button ── */}
                {isAdmin && (
                    <div className="pr-admin-bar">
                        <button onClick={toggleModal} className="pr-add-btn">
                            <Plus size={18} />
                            <span>Add Project</span>
                        </button>
                    </div>
                )}

                {/* ── Projects Grid ── */}
                {projects.length === 0 ? (
                    <div className="pr-empty">
                        <p className={darkMode ? 'pr-muted-dark' : 'pr-muted-light'}>No projects to display yet.</p>
                    </div>
                ) : (
                    <div className="pr-grid">
                        {projects.map((project, index) => {
                            const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
                            const isHovered = hoveredCard === index;
                            return (
                                <div
                                    key={project._id || project.id}
                                    className={`pr-card ${darkMode ? 'pr-card-dark' : 'pr-card-light'} ${isHovered ? 'pr-card-hovered' : ''} ${project.featured ? 'pr-card-featured' : ''}`}
                                    style={{ '--pr-from': accent.from, '--pr-to': accent.to }}
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    {/* Top accent line */}
                                    <div className="pr-card-topline"
                                        style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
                                    />

                                    {/* Featured badge */}
                                    {project.featured && (
                                        <div className="pr-featured-badge" style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}>
                                            <Sparkles size={11} />
                                            Featured
                                        </div>
                                    )}

                                    {/* Image wrapper */}
                                    <div className="pr-img-wrap">
                                        <img src={project.image} alt={project.title} className="pr-img" />
                                        <div className="pr-img-overlay" style={{ background: `linear-gradient(to top, ${accent.from}cc, transparent)` }} />
                                        <div className="pr-img-hover-btn">
                                            <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="pr-hover-link" style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}>
                                                <ExternalLink size={15} />
                                                <span>Live Preview</span>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Card body */}
                                    <div className="pr-body">
                                        <h3 className="pr-card-title" style={{ backgroundImage: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}>
                                            {project.title}
                                        </h3>
                                        <p className={`pr-card-desc ${darkMode ? 'pr-muted-dark' : 'pr-muted-light'}`}>
                                            {project.description}
                                        </p>

                                        {/* Tech tags */}
                                        <div className="pr-tags">
                                            {project.technologies?.map((tech, ti) => {
                                                const pal = TAG_PALETTES[ti % TAG_PALETTES.length];
                                                return (
                                                    <span key={tech} className="pr-tag" style={{ background: pal.bg, borderColor: pal.border, color: pal.color }}>
                                                        {tech}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        {/* Admin actions */}
                                        {isAdmin && (
                                            <div className="pr-admin-actions">
                                                <button onClick={() => handleEditProject(project)} className="pr-edit-btn">
                                                    <Edit size={14} /> Edit
                                                </button>
                                                <button onClick={() => handleDeleteProject(project._id || project.id, project.title)} className="pr-delete-btn">
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        )}

                                        {/* Links */}
                                        <div className="pr-links">
                                            <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="pr-demo-link" style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}>
                                                <Eye size={15} />
                                                <span>Live Demo</span>
                                            </a>
                                            <a href={project.github} target="_blank" rel="noopener noreferrer" className={`pr-github-link ${darkMode ? 'pr-github-dark' : 'pr-github-light'}`}>
                                                <Github size={15} />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Bottom glow */}
                                    <div className="pr-card-glow" style={{ background: `radial-gradient(ellipse at bottom, ${accent.from}18 0%, transparent 70%)` }} />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* View All button */}
                <div className="pr-center" style={{ marginTop: '3rem' }}>
                    <button className="pr-view-all">
                        {content.viewAllBtn}
                    </button>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AddProject
                isOpen={isModalOpen}
                onClose={toggleModal}
                darkMode={darkMode}
                initialData={projectToEdit}
                refreshProjects={fetchProjects}
            />
        </section>
    );
};

export default Projects;