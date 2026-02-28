import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    Download, Github, Linkedin, Mail, Twitter, Instagram,
    Youtube, Facebook, Globe, Link as LinkIcon
} from "lucide-react";
import BlurText from "./BlurText";
import GlitchText from "./GlitchText.jsx";
import LiquidEther from './LiquidEther.jsx';
import ProfileCard from './ProfileCard.jsx';
import { API_URLS } from '../apiConfig';
import SectionEditor from './SectionEditor';
import SocialLinksEditor from './SocialLinksEditor';

const CHECK_ROLE_API_BASE_URL = API_URLS.CHECK_ROLE;

const ICON_MAP = {
    github: <Github size={24} />,
    linkedin: <Linkedin size={24} />,
    twitter: <Twitter size={24} />,
    instagram: <Instagram size={24} />,
    youtube: <Youtube size={24} />,
    facebook: <Facebook size={24} />,
    globe: <Globe size={24} />,
    link: <LinkIcon size={24} />
};

const Hero = ({ darkMode }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(typeof window !== 'undefined' && window.innerWidth <= 500);
    const [content, setContent] = useState({
        description: 'I create modern, responsive, and user-friendly web applications using cutting-edge technologies. Let\'s build something amazing together!',
        downloadCvBtn: 'Download CV',
        viewWorkBtn: 'View My Work',
        profileName: 'M.khalil Mejri',
        profileTitle: 'Software Engineer',
        profileContactBtn: 'Contact Me',
        socialLinks: [
            { id: 1, platform: 'github', url: '#' },
            { id: 2, platform: 'linkedin', url: 'https://www.linkedin.com/in/khalil-mejri-141b4b308/' },
            { id: 3, platform: 'globe', url: '#' }
        ]
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
                if (res.data) {
                    const data = res.data;
                    if (!data.socialLinks) data.socialLinks = [];
                    setContent(data);
                }
            } catch (err) {
                console.error("Error fetching hero content:", err);
            } finally {
                setLoading(false);
            }
        };

        checkAdminRole();
        fetchContent();

        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 500);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSave = async (values) => {
        try {
            const updatedContent = { ...content, ...values };
            await axios.post(API_URLS.HERO, updatedContent);
            setContent(updatedContent);
        } catch (err) {
            console.error("Error saving hero content:", err);
            alert("Failed to save changes.");
        }
    };

    const handleSocialSave = async (newLinks) => {
        try {
            const updatedContent = { ...content, socialLinks: newLinks };
            await axios.post(API_URLS.HERO, updatedContent);
            setContent(updatedContent);
        } catch (err) {
            console.error("Error saving social links:", err);
            alert("Failed to save social links.");
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
        <section id="home" className={`hero-section ${darkMode ? "dark-mode" : "light-mode"}`}>
            <div className="admin-editors-group" style={{
                position: 'absolute',
                top: '5rem',
                right: '1.2rem',
                zIndex: 100,
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
            }}>
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
                <SocialLinksEditor
                    isAdmin={isAdmin}
                    darkMode={darkMode}
                    initialLinks={content.socialLinks}
                    onSave={handleSocialSave}
                    accentColor="#3b82f6"
                />
            </div>

            <div className="bloc_design_hero">
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    mouseForce={isSmallScreen ? 0 : 10}
                    cursorSize={isSmallScreen ? 30 : 60}
                    isViscous={false}
                    viscous={30}
                    iterationsViscous={isSmallScreen ? 4 : 8}
                    iterationsPoisson={isSmallScreen ? 4 : 8}
                    resolution={isSmallScreen ? 0.15 : 0.2}
                    isBounce={false}
                    autoDemo={true}
                    autoSpeed={isSmallScreen ? 0.4 : 0.2}
                    autoIntensity={isSmallScreen ? 1.5 : 1.0}
                    takeoverDuration={0.2}
                    autoResumeDelay={1}
                    autoRampDuration={0}
                />
            </div>

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
                                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }}
                    />

                    <p className={`hero-description ${darkMode ? "text-dark" : "text-light"}`}>
                        {content.description}
                    </p>

                    <div className="cta-buttons">
                        <button className="cta-button primary-cta">
                            <Download size={20} />
                            {content.downloadCvBtn}
                        </button>

                        <button onClick={handleScrollToProjects} className="cta-button secondary-cta">
                            {content.viewWorkBtn}
                        </button>
                    </div>

                    <div className="social-links">
                        {content.socialLinks && content.socialLinks.map((link) => {
                            const url = link.url && (link.url.startsWith('http') || link.url.startsWith('mailto:'))
                                ? link.url
                                : `https://${link.url}`;

                            return (
                                <a
                                    key={link.id}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`social-icon ${darkMode ? "dark-social" : "light-social"} ${link.platform}-link`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '12px',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {ICON_MAP[link.platform] || <Globe size={24} />}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;