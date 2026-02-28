import React from "react";
import { Moon, Sun } from "lucide-react";
import PillNav from './PillNav.jsx';

const Header = ({
  darkMode,
  toggleDarkMode,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className={`header ${darkMode ? "dark-mode-bg dark-border headerdarkmode" : "light-mode-bg light-border headerlightmode"}`}>
      <nav className="nav-container">
        <div className="header-inner">

          {/* ── Logo ── */}
          <div className={`logo ${darkMode ? 'dark-text' : 'light-text'}`}>
            M.khalil
          </div>

          {/*
           * ── Desktop nav (center flex:1) ──
           * On mobile → display:none via CSS
           */}
          <div className={`header-nav-desktop ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <PillNav
              items={[
                { label: 'Home', href: 'home' },
                { label: 'About', href: 'about' },
                { label: 'Skills', href: 'skills' },
                { label: 'Projects', href: 'projects' },
                { label: 'Timeline', href: 'timeline' },
                { label: 'Contact', href: 'contact' },
              ]}
              activeHref="/"
              ease="power2.easeOut"
              darkMode={darkMode}
              baseColor={darkMode ? '#c4b5fd' : '#4338ca'}
              pillColor="transparent"
              hoveredPillTextColor="#ffffff"
              pillTextColor={darkMode ? 'rgba(196,181,253,0.85)' : 'rgba(30,27,75,0.72)'}
              onItemClick={(section) => scrollToSection(section)}
            />
          </div>

          {/*
           * ── Right section: hamburger (mobile) + toggle button ──
           * PillNav renders the hamburger button inside pill-nav-container.
           * We wrap it with the toggle button in a flex row.
           */}
          <div className={`header-right ${darkMode ? 'dark-mode' : 'light-mode'}`}>

            {/* PillNav here only to render the hamburger + dropdown */}
            <div className="header-hamburger-wrap">
              <PillNav
                items={[
                  { label: 'Home', href: 'home' },
                  { label: 'About', href: 'about' },
                  { label: 'Skills', href: 'skills' },
                  { label: 'Projects', href: 'projects' },
                  { label: 'Timeline', href: 'timeline' },
                  { label: 'Contact', href: 'contact' },
                ]}
                activeHref="/"
                ease="power2.easeOut"
                darkMode={darkMode}
                baseColor={darkMode ? '#c4b5fd' : '#4338ca'}
                pillColor="transparent"
                hoveredPillTextColor="#ffffff"
                pillTextColor={darkMode ? 'rgba(196,181,253,0.85)' : 'rgba(30,27,75,0.72)'}
                onItemClick={(section) => scrollToSection(section)}
                initialLoadAnimation={false}
              />
            </div>

            {/* Dark / Light toggle */}
            <button
              onClick={toggleDarkMode}
              className={`nav-button ${darkMode ? 'dark-button' : 'light-button'}`}
              aria-label="Toggle dark/light mode"
            >
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

          </div>

        </div>
      </nav>
    </header>
  );
};

export default Header;