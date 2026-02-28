import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // 👈🏻 استيراد React Router
import Header from './components/Header';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Timeline from './components/Timeline.jsx';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ClickSpark from './components/ClickSpark.jsx';

// 👈🏻 استيراد مكون صفحة تسجيل الدخول
import AdminLogin from './components/AdminLogin.jsx';

// 👈🏻 تعريف مكون منفصل يضم جميع مكونات الصفحة الرئيسية
const MainPortfolio = ({ darkMode, toggleDarkMode, mobileMenuOpen, setMobileMenuOpen }) => (
  <>
    <Header
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
    />
    <Hero darkMode={darkMode} />

    {/* ── Shared background: About / Skills / Projects / Journey / Contact ── */}
    <div className={`shared-bg-wrapper ${darkMode ? 'shared-bg-dark' : 'shared-bg-light'}`}>
      {/* Shared decorative orbs rendered once */}
      <div className="shared-orb shared-orb-tl" />
      <div className="shared-orb shared-orb-tr" />
      <div className="shared-orb shared-orb-mid" />
      <div className="shared-orb shared-orb-br" />

      <About darkMode={darkMode} />
      <Skills darkMode={darkMode} />
      <Projects darkMode={darkMode} />
      <Timeline darkMode={darkMode} />
      <Contact darkMode={darkMode} />
    </div>

    <Footer darkMode={darkMode} />
  </>
);

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    // يجب أن يكون التطبيق بأكمله مغلفاً بـ <Router>
    <Router>
      <ClickSpark
        sparkColor={darkMode ? '#8c8c8c' : '#000000'}
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black' : 'bg-white'
          }`}>

          <Routes>
            {/* المسار الافتراضي (/) لعرض جميع مكونات البورتفوليو */}
            <Route
              path="/"
              element={<MainPortfolio
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
              />}
            />

            {/* المسار /admin لعرض صفحة تسجيل الدخول فقط */}
            <Route
              path="/admin"
              element={<AdminLogin darkMode={darkMode} />}
            />
          </Routes>

        </div>
      </ClickSpark>
    </Router>
  );
}

export default App;