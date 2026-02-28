import {
  Moon, Sun, Home, User, Cpu, Layers, Activity, Mail
} from "lucide-react";
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

  const navItems = [
    { label: 'Home', href: 'home', icon: <Home size={15} /> },
    { label: 'About', href: 'about', icon: <User size={15} /> },
    { label: 'Skills', href: 'skills', icon: <Cpu size={15} /> },
    { label: 'Projects', href: 'projects', icon: <Layers size={15} /> },
    { label: 'Timeline', href: 'timeline', icon: <Activity size={15} /> },
    { label: 'Contact', href: 'contact', icon: <Mail size={15} /> },
  ];

  return (
    <header className={`header ${darkMode ? "dark-mode-bg dark-border headerdarkmode" : "light-mode-bg light-border headerlightmode"}`}>
      <nav className="nav-container">
        <div className="header-inner">

          <div
            className="logo-wrap"
            onClick={() => scrollToSection('home')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <img
              src="/logo prot.svg"
              alt="Logo"
              className="header-logo-img"
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
            <span className={`logo-text ${darkMode ? 'dark-text' : 'light-text'}`} style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              M.khalil
            </span>
          </div>

          {/* ── Desktop nav ── */}
          <div className={`header-nav-desktop ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <PillNav
              items={navItems}
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

          {/* ── Right section ── */}
          <div className={`header-right ${darkMode ? 'dark-mode' : 'light-mode'}`}>

            <div className="header-hamburger-wrap">
              <PillNav
                items={navItems}
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