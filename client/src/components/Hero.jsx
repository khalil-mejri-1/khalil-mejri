import React, { useCallback } from "react";
// Lucide icons are used, these imports remain the same
import { Download, Github, Linkedin, Mail } from "lucide-react";
// Assuming BlurText and GlitchText are correctly defined and imported
import BlurText from "./BlurText";
import GlitchText from "./GlitchText.jsx";
import LiquidEther from './LiquidEther.jsx';
import ProfileCard from './ProfileCard.jsx'

// Import the new plain CSS file

const Hero = ({ darkMode }) => {

    // Function to handle smooth scrolling to the #projects section
    const handleScrollToProjects = useCallback((e) => {
        e.preventDefault();
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            // Note: 'smooth' behavior is standard and still works here
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
     

 
       <section
            id="home"
            // Replace Tailwind classes with a single primary class and a conditional dark mode class
            className={`hero-section ${darkMode ? "dark-mode" : "light-mode"}`}
        >
          <div className="bloc_design_hero">

               <LiquidEther
    colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
    mouseForce={20}
    cursorSize={100}
    isViscous={false}
    viscous={30}
    iterationsViscous={32}
    iterationsPoisson={32}
    resolution={0.5}
    isBounce={false}
    autoDemo={true}
    autoSpeed={0.5}
    autoIntensity={2.2}
    takeoverDuration={0.25}
    autoResumeDelay={3000}
    autoRampDuration={0.6}
  />
          </div>
          
            {/* Animated Background */}
            <div className="hero-background">
                <div className="background-blob blob-one"></div>
                <div className="background-blob blob-two"></div>
            </div>

            <div className="hero-container">
                <div className="hero-content">
                    {/* Profile Picture Placeholder */}
                    {/* <div className="profile-picture-wrapper">
                        <div className="profile-picture-border animate-pulse-custom">
                            <div
                                className={`profile-picture-inner ${
                                    darkMode ? "bg-dark" : "bg-light"
                                }`}
                            >
                                <img
                                    src="https://i.ibb.co/qYJFPbVv/376629158-287324097379413-1266078279128219434-n.jpg"
                                    alt="Profile"
                                    className="profile-image"
                                />
                            </div>
                        </div>
                        <div className="status-indicator animate-pulse-custom"></div>
                    </div> */}

<ProfileCard
  name="M.khalil Mejri"
  title="Software Engineer"
  contactText="Contact Me"
  avatarUrl="https://i.ibb.co/84xQ81qL/Untitled-design-5.png"
  showUserInfo={true}
  enableTilt={true}
  enableMobileTilt={true}
  onContactClick={() => {
    // 1. Find the target element by its ID
    const contactSection = document.getElementById('contact');

    // 2. Check if the element exists before scrolling
    if (contactSection) {
      // 3. Use scrollIntoView() with the 'smooth' behavior option
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start', // Scroll to the top of the element
      });
    }
  }}
/>

                    {/* Name and Title */}
                    <div className="hero-name">
                        <div className="glitch_bloc">
                            {/* <GlitchText speed={1} enableShadows enableOnHover={false}>
                                MED KHALIL MEJRI
                            </GlitchText> */}
                          
                              
                        </div>
                    </div>

                    {/* <p className={`hero-title ${darkMode ? "text-dark" : "text-light"}`}>
                        <BlurText
                            text="Full Stack Developer specialized in building high-quality web applications"
                            delay={50}
                            animateBy="letters"
                            direction="top"
                            className="hero-title-text"
                        />
                    </p> */}

                    <p className={`hero-description ${darkMode ? "text-dark" : "text-light"}`}>
                        I create modern, responsive, and user-friendly web applications
                        using cutting-edge technologies. Let's build something amazing
                        together!
                    </p>

                    {/* CTA Buttons */}
                    <div className="cta-buttons">
                        <button className="cta-button primary-cta">
                            <Download size={20} />
                            Download CV
                        </button>

                        <button
                            onClick={handleScrollToProjects}
                            className="cta-button secondary-cta"
                        >
                            View My Work
                        </button>
                    </div>

                    {/* Social Links */}
                    <div className="social-links">
                        <a
                            href="#"
                            className={`social-icon ${
                                darkMode ? "dark-social" : "light-social"
                            } github-link`}
                        >
                            <Github size={24} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/khalil-mejri-141b4b308/"
                            className={`social-icon ${
                                darkMode ? "dark-social" : "light-social"
                            } linkedin-link`}
                        >
                            <Linkedin size={24} />
                        </a>
                        <a
                            href="mailto:your.email@example.com"
                            className={`social-icon ${
                                darkMode ? "dark-social" : "light-social"
                            } mail-link`}
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