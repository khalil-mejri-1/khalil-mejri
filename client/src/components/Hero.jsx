import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Download, Github, Linkedin, Mail } from "lucide-react";
import BlurText from "./BlurText";
import GlitchText from "./GlitchText.jsx";
import LiquidEther from './LiquidEther.jsx';
import ProfileCard from './ProfileCard.jsx';
import { API_URLS } from '../apiConfig';
import SectionEditor from './SectionEditor';

const CHECK_ROLE_API_BASE_URL = API_URLS.CHECK_ROLE;

const Hero = ({ darkMode }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState({
        description: 'I create modern, responsive, and user-friendly web applications using cutting-edge technologies. Let\'s build something amazing together!',
        downloadCvBtn: 'Download CV',
        viewWorkBtn: 'View My Work',
        profileName: 'M.khalil Mejri',
        profileTitle: 'Software Engineer',
        profileContactBtn: 'Contact Me',
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

        const fetchContent = async () => {
            try {
                const res = await axios.get(API_URLS.HERO);
                if (res.data) setContent(res.data);
            } catch (err) {
                console.error("Error fetching hero content:", err);
            } finally {
                setLoading(false);
            }
        };

        checkAdminRole();
        fetchContent();
    }, []);

    const handleSave = async (values) => {
        try {
            await axios.post(API_URLS.HERO, values);
            setContent(prev => ({ ...prev, ...values }));
        } catch (err) {
            console.error("Error saving hero content:", err);
            alert("Failed to save changes.");
        }
    };

    const handleScrollToProjects = useCallback((e) => {
        e.preventDefault();
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    if (loading) {
        return (
            <section id="home" className={`hero-section ${darkMode ? "dark-mode" : "light-mode"}`}>
                <div className="hero-container">
                    <div className="hero-content" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="skeleton skeleton-circle" style={{ width: 300, height: 400, borderRadius: '24px', marginBottom: '2rem' }}></div>
                        <div className="skeleton skeleton-title" style={{ width: '40%', marginBottom: '1.5rem' }}></div>
                        <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                        <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: '2rem' }}></div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="skeleton skeleton-pill" style={{ width: 150, height: 50 }}></div>
                            <div className="skeleton skeleton-pill" style={{ width: 150, height: 50 }}></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="home"
            className={`hero-section ${darkMode ? "dark-mode" : "light-mode"}`}
        >
            {/* Admin Section Editor */}
            <SectionEditor
                isAdmin={isAdmin}
                darkMode={darkMode}
                accentColor="#8c8cff"
                fields={[
                    { key: 'profileName', label: 'Profile Name', value: content.profileName },
                    { key: 'profileTitle', label: 'Profile Title', value: content.profileTitle },
                    { key: 'profileContactBtn', label: 'Contact Button Text', value: content.profileContactBtn },
                    { key: 'description', label: 'Hero Description', value: content.description, multiline: true },
                    { key: 'downloadCvBtn', label: '"Download CV" Button', value: content.downloadCvBtn },
                    { key: 'viewWorkBtn', label: '"View Work" Button', value: content.viewWorkBtn },
                ]}
                onSave={handleSave}
            />

            <div className="bloc_design_hero">
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    mouseForce={10}
                    cursorSize={60}
                    isViscous={false}
                    viscous={30}
                    iterationsViscous={8}
                    iterationsPoisson={8}
                    resolution={0.2}
                    isBounce={false}
                    autoDemo={true}
                    autoSpeed={0.2}
                    autoIntensity={1.0}
                    takeoverDuration={0.2}
                    autoResumeDelay={1}
                    autoRampDuration={0}
                />
            </div>

            {/* Animated Background */}
            <div className="hero-background">
                <div className="background-blob blob-one"></div>
                <div className="background-blob blob-two"></div>
            </div>

            <div className="hero-container">
                <div className="hero-content">
                    <ProfileCard
                        name={content.profileName}
                        title={content.profileTitle}
                        contactText={content.profileContactBtn}
                        avatarUrl="https://i.ibb.co/84xQ81qL/Untitled-design-5.png"
                        showUserInfo={true}
                        enableTilt={true}
                        enableMobileTilt={true}
                        onContactClick={() => {
                            const contactSection = document.getElementById('contact');
                            if (contactSection) {
                                contactSection.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start',
                                });
                            }
                        }}
                    />

                    {/* Name and Title */}
                    <div className="hero-name">
                        <div className="glitch_bloc">
                        </div>
                    </div>

                    <p className={`hero-description ${darkMode ? "text-dark" : "text-light"}`}>
                        {content.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="cta-buttons">
                        <button className="cta-button primary-cta">
                            <Download size={20} />
                            {content.downloadCvBtn}
                        </button>

                        <button
                            onClick={handleScrollToProjects}
                            className="cta-button secondary-cta"
                        >
                            {content.viewWorkBtn}
                        </button>
                    </div>

                    {/* Social Links */}
                    <div className="social-links">
                        <a
                            href="#"
                            className={`social-icon ${darkMode ? "dark-social" : "light-social"} github-link`}
                        >
                            <Github size={24} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/khalil-mejri-141b4b308/"
                            className={`social-icon ${darkMode ? "dark-social" : "light-social"} linkedin-link`}
                        >
                            <Linkedin size={24} />
                        </a>
                        <a
                            href="mailto:your.email@example.com"
                            className={`social-icon ${darkMode ? "dark-social" : "light-social"} mail-link`}
                        >
                            <Mail size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;