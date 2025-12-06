import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ExternalLink, Github, Eye, Plus, Edit, Trash2 } from 'lucide-react'; 
import AddProject from './addProejct'; 

const PROJECTS_API_URL = 'http://localhost:3000/api/projects'; 
const CHECK_ROLE_API_BASE_URL = 'http://localhost:3000/check-role';

const Projects = ({ darkMode }) => {
    // 1. حالات إدارة البيانات والواجهة
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 2. حالات إدارة صلاحيات المسؤول والنموذج المنبثق
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminCheckLoading, setIsAdminCheckLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [projectToEdit, setProjectToEdit] = useState(null); 

    // دالة لجلب المشاريع (مغلفة بـ useCallback لضمان الاستقرار)
    const fetchProjects = useCallback(async () => {
        try {
            const response = await axios.get(PROJECTS_API_URL);
            const fetchedData = response.data; 

            if (Array.isArray(fetchedData)) {
                setProjects(fetchedData);
            } else if (fetchedData.projects && Array.isArray(fetchedData.projects)) {
                setProjects(fetchedData.projects);
            } else {
                console.error("API did not return a valid array of projects.");
                setError("هيكل بيانات المشاريع المسترجع غير صالح.");
                setProjects([]);
            }
        } catch (err) {
            console.error("Failed to fetch projects:", err);
            setError("فشل في الاتصال بالخادم أو جلب المشاريع.");
        } finally {
            setLoading(false);
        }
    }, []);

    // دالة لتبديل حالة النموذج المنبثق
    const toggleModal = () => {
        setIsModalOpen(prev => {
            if (prev) {
                setProjectToEdit(null);
            }
            return !prev;
        });
    };

    // دالة لفتح نموذج التعديل وتحميل بيانات المشروع
    const handleEditProject = (project) => {
        setProjectToEdit(project);
        setIsModalOpen(true);
    };

    // دالة للحذف
    const handleDeleteProject = async (projectId, projectTitle) => {
        if (window.confirm(`Are you sure you want to delete the project: ${projectTitle}?`)) {
            try {
                await axios.delete(`${PROJECTS_API_URL}/${projectId}`);
                
                setProjects(prevProjects => 
                    prevProjects.filter(p => p._id !== projectId)
                );
                
                alert(`Project "${projectTitle}" deleted successfully.`);
            } catch (err) {
                console.error("Failed to delete project:", err);
                alert(`Failed to delete project: ${err.response?.data?.message || 'Server error'}`);
            }
        }
    };

    // --- خطاف useEffect: جلب المشاريع والتحقق من صلاحية المسؤول عند التحميل ---
    useEffect(() => {
        const checkAdminRole = async () => {
            const adminEmail = localStorage.getItem('adminEmail'); 

            if (!adminEmail) {
                setIsAdmin(false);
                setIsAdminCheckLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${CHECK_ROLE_API_BASE_URL}/${adminEmail}`);
                
                if (response.data.success && response.data.isAdmin) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (err) {
                console.error("Failed to check admin role:", err.message);
                setIsAdmin(false); 
            } finally {
                setIsAdminCheckLoading(false);
            }
        };

        fetchProjects();
        checkAdminRole();
    }, [fetchProjects]);

    // 3. عرض حالات التحميل والخطأ
    if (loading || isAdminCheckLoading) {
        return (
            <section id="projects" className={`loading-section ${darkMode ? 'dark-mode' : ''}`}>
                <div className="container text-center">
                    <p className="loading-text">جاري تحميل البيانات... ⏳</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="projects" className={`error-section ${darkMode ? 'dark-mode' : ''}`}>
                <div className="container text-center">
                    <p className="error-text">⚠️ {error}</p>
                    <p className={`error-subtext ${darkMode ? 'dark-mode' : ''}`}>الرجاء التحقق من رابط API.</p>
                </div>
            </section>
        );
    }


    // 4. عرض المكون باستخدام البيانات المجلوبة 
    return (
        <section id="projects" className={`projects-section ${darkMode ? 'dark-mode' : ''}`}>
            <div className="container">
                <div className="text-center section-header">
                    <h2 className={`section-title ${
                        darkMode ? 'dark-mode-text' : 'light-mode-text'
                    }`}>
                        My <span className="title-highlight">Projects</span>
                    </h2>
                    <p className={`section-subtitle ${
                        darkMode ? 'dark-mode-subtext' : 'light-mode-subtext'
                    }`}>
                        Here are some of my recent projects that showcase my skills and experience
                    </p>
                </div>

                {/* زر 'Add Project' يظهر فقط للمسؤول */}
                {isAdmin && (
                    <div className="admin-add-button-wrapper">
                        <button 
                            onClick={toggleModal}
                            className="add-project-button"
                        >
                            <Plus size={20} className="rtl-icon" /> 
                            <span>Add Project</span>
                        </button>
                    </div>
                )}

                {/* عرض المشاريع */}
                {projects.length === 0 ? (
                    <div className="no-projects-message">
                        <p className={`no-projects-text ${darkMode ? 'dark-mode-subtext' : 'light-mode-subtext'}`}>لا توجد مشاريع لعرضها حاليًا.</p>
                    </div>
                ) : (
                    <div className="projects-grid">
                    {projects.map((project) => (
                        <div
                        key={project._id || project.id} 
                        className={`project-card group ${
                            darkMode ? 'dark-mode-card' : 'light-mode-card'
                        } ${
                            project.featured ? 'featured-card' : ''
                        }`}
                        >
                        {project.featured && (
                            <div className="featured-badge">
                            Featured
                            </div>
                        )}

                        <div className="project-image-wrapper">
                            <img
                            src={project.image}
                            alt={project.title}
                            className="project-image"
                            />
                            <div className="project-overlay" />

                            <div className="project-actions-hover">
                                <a
                                    href={project.liveDemo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="demo-button"
                                >
                                    <ExternalLink size={16} />
                                    <span>Demo</span>
                                </a>
                            </div>
                        </div>

                        <div className="project-content">
                            <h3 className={`project-title ${
                                darkMode ? 'dark-mode-text' : 'light-mode-text'
                            }`}>
                                {project.title}
                            </h3>
                            <p className={`project-description ${
                                darkMode ? 'dark-mode-subtext' : 'light-mode-subtext'
                            }`}>
                                {project.description}
                            </p>

                            <div className="project-tech-list">
                                {project.technologies?.map((tech) => (
                                    <span
                                    key={tech}
                                    className="tech-tag"
                                    >
                                    {tech}
                                    </span>
                                ))}
                            </div>
                            
                            {/* أزرار التعديل والحذف */}
                            {isAdmin && (
                                <div className="admin-actions-wrapper">
                                    <button
                                        onClick={() => handleEditProject(project)}
                                        className="admin-edit-button"
                                    >
                                        <Edit size={16} />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProject(project._id || project.id, project.title)} 
                                        className="admin-delete-button"
                                    >
                                        <Trash2 size={16} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}

                            {/* الروابط الأصلية (Demo/GitHub) */}
                            <div className="project-links-wrapper"> 
                                <a
                                    href={project.liveDemo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="live-demo-link"
                                >
                                    <Eye size={16} />
                                    <span>Live Demo</span>
                                </a>
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`github-link ${
                                        darkMode
                                            ? 'dark-mode-github'
                                            : 'light-mode-github'
                                    }`}
                                >
                                    <Github size={16} />
                                </a>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <button className="view-all-button">
                        View All Projects
                    </button>
                </div>
            </div>

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