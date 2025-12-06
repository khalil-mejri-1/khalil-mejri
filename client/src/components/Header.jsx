import React, { useEffect, useRef } from "react"; // ⚠️ تم إضافة useRef
import { Moon, Sun, Menu, X } from "lucide-react";
import GooeyNav from "./GooeyNav.jsx";
// افتراض أنك لا تزال تستورد ملف Header.css
// import './Header.css'; 

const Header = ({
  darkMode,
  toggleDarkMode,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  
  // 💡 المرجع للقائمة الجانبية - Sidebar
  const sidebarRef = useRef(null);
  // 💡 المرجع لزر فتح/إغلاق القائمة
  const toggleButtonRef = useRef(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    "Home",
    "About",
    "Skills",
    "Projects",
    "Timeline",
    "Contact",
  ];

  const items = [
    { label: "Home" },
    { label: "About" },
    { label: "Skills" },
    { label: "Projects" },
    { label: "Timeline" },
    { label: "Contact" },
  ];

  // --------------------------------------------------
  // 💡 إضافة useEffect لمعالجة النقر خارج القائمة (Click Outside Logic)
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 1. تحقق مما إذا كانت القائمة مفتوحة
      if (!mobileMenuOpen) {
        return;
      }
      
      // 2. التحقق مما إذا كان النقر خارج القائمة الجانبية (sidebarRef)
      const isOutsideSidebar = sidebarRef.current && !sidebarRef.current.contains(event.target);
      
      // 3. التحقق مما إذا كان النقر ليس على زر الفتح/الإغلاق (toggleButtonRef)
      //    (نستخدم parentNode هنا لأن الزر مغلف بـ sidebar-toggle-group)
      const isNotToggleButton = toggleButtonRef.current && !toggleButtonRef.current.contains(event.target);

      if (isOutsideSidebar && isNotToggleButton) {
        setMobileMenuOpen(false);
      }
    };

    // إضافة المستمع عند تحميل المكون
    document.addEventListener("mousedown", handleClickOutside);

    // تنظيف المستمع عند إلغاء تحميل المكون
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, setMobileMenuOpen]); 
  // --------------------------------------------------

  const headerClass = `header ${
    darkMode ? "dark-mode-bg dark-border" : "light-mode-bg light-border"
  }`;
  
  const navContainerClass = "nav-container";
  const logoClass = "logo";
  
  const navButtonClass = `nav-button ${
    darkMode 
      ? "dark-button dark-button-hover" 
      : "light-button light-button-hover"
  }`;
  
  const desktopNavClass = "desktop-only";

  const mobileMenuButtonClass = `mobile-menu-button ${
    darkMode 
      ? "dark-mobile-button dark-mobile-button-hover" 
      : "light-mobile-button light-mobile-button-hover"
  }`;
  
  const mobileLinkClass = (isDark) => 
    `mobile-link ${isDark ? "dark-mobile-link" : "light-mobile-link"}`;
  
  const sidebarClass = `sidebar-menu ${mobileMenuOpen ? 'open' : ''} ${darkMode ? 'dark-sidebar-glow' : 'light-sidebar-shadow'}`;


  return (
    <header className={headerClass}>
      <nav className={navContainerClass}>
        <div className="flex items-center justify-between">
          
          <div className={logoClass} style={{ color: "white" }}>
            Med khalil
          </div>

          <div className={desktopNavClass}> 
            <GooeyNav
              items={items}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
              darkMode={darkMode}
              onClickItem={scrollToSection}
            />
          </div>

          <div className="flex items-center space-x-4">
            
            <button 
              onClick={toggleDarkMode} 
              className={`${navButtonClass} ${desktopNavClass}`}
              disabled
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* 💡 ربط مرجع toggleButtonRef بهذه المجموعة */}
            <div className="sidebar-toggle-group" ref={toggleButtonRef}> 
                <button 
                    onClick={toggleDarkMode} 
                    className={navButtonClass}
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={mobileMenuButtonClass}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 💡 ربط مرجع sidebarRef بالقائمة الجانبية */}
      <div className={sidebarClass} ref={sidebarRef}>
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => scrollToSection(item)}
            className={`${mobileLinkClass(darkMode)} sidebar-link-style`}
          >
            {item}
          </button>
        ))}
      </div>
      
      {/* ⚠️ تم إزالة طبقة التعتيم (Overlay) لأنها لم تعد ضرورية. 
        وظيفة handleClickOutside هي من سيتولى الإغلاق الآن، 
        مما يسمح للمستخدم بالنقر في أي مكان في الصفحة لإغلاق القائمة.
      */}
      {/* {mobileMenuOpen && (
        <div 
            className="overlay" 
            onClick={() => setMobileMenuOpen(false)}
        ></div>
      )} */}

    </header>
  );
};

export default Header;