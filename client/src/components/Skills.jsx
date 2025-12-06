import React from 'react';

const Skills = ({ darkMode }) => {
  // تم تحديث البيانات لتضمين الأيقونة واللون الخاص بها (مفصول عن Glow)
  const skillCategories = [
    {
      title: "Frontend Focus",
      gradient: "from-blue-500 to-cyan-500", // تدرج عنوان الفئة (سنستبدله بفئة CSS)
      skills: [
        { name: "HTML5", icon: "fab fa-html5", color: "text-orange-500", glow: "shadow-orange-500/50" },
        { name: "CSS3", icon: "fab fa-css3-alt", color: "text-blue-500", glow: "shadow-blue-500/50" },
        { name: "JavaScript", icon: "fab fa-js", color: "text-yellow-400", glow: "shadow-yellow-400/50" },
        { name: "React", icon: "fab fa-react", color: "text-cyan-400", glow: "shadow-cyan-400/50" },
        { name: "Tailwind", icon: "fas fa-fan", color: "text-teal-400", glow: "shadow-teal-400/50" },
      ]
    },
    {
      title: "Server & Data",
      gradient: "from-purple-500 to-indigo-500",
      skills: [
        { name: "Node.js", icon: "fab fa-node-js", color: "text-green-500", glow: "shadow-green-500/50" },
        { name: "Express.js", icon: "fas fa-bolt", color: "text-gray-400", glow: "shadow-gray-400/50" },
        { name: "PHP", icon: "fab fa-php", color: "text-indigo-500", glow: "shadow-indigo-500/50" },
        { name: "MongoDB", icon: "fas fa-database", color: "text-lime-500", glow: "shadow-lime-500/50" },
        { name: "MySQL", icon: "fas fa-server", color: "text-blue-600", glow: "shadow-blue-600/50" },
      ]
    },
    {
      title: "Tools & Flow",
      gradient: "from-green-500 to-lime-500",
      skills: [
        { name: "Git", icon: "fab fa-git-alt", color: "text-red-600", glow: "shadow-red-600/50" },
        { name: "GitHub", icon: "fab fa-github", color: `${darkMode ? 'text-white' : 'text-gray-800'}`, glow: "shadow-white/40" },
        { name: "Docker", icon: "fab fa-docker", color: "text-blue-600", glow: "shadow-blue-600/50" },
        { name: "Figma", icon: "fab fa-figma", color: "text-pink-500", glow: "shadow-pink-500/50" },
      ]
    }
  ];

  // دالة مساعدة لتحويل فئات Tailwind للألوان إلى فئات CSS قياسية
  const mapColorToClass = (tailwindClass) => {
    // هذه دالة تبسيطية. في CSS الفعلي، يجب أن تتطابق هذه الفئات مع الألوان.
    // سنعيدها كما هي في JSX ونعرّفها كـ CSS variables.
    return tailwindClass.replace('text-', 'skill-color-');
  };

  const mapGradientToClass = (tailwindGradient) => {
    if (tailwindGradient.includes('blue-500')) return 'gradient-blue-cyan';
    if (tailwindGradient.includes('purple-500')) return 'gradient-purple-indigo';
    if (tailwindGradient.includes('green-500')) return 'gradient-green-lime';
    return '';
  };

  return (
    <section id="skills" className={`skills-section ${darkMode ? 'dark-mode' : 'light-mode'}`}>

      {/* خلفية الشبكة/الماتريكس المضيئة (Matrix Background) */}
      <div className={`absolute-grid-overlay ${darkMode ? 'dark-grid' : 'light-grid'}`}></div>

      <div className="container relative-z-10">

        {/* العنوان */}
        <div className="text-center section-header">
          <h2 className={`section-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            My <span className="highlight-text">Tech Stack</span>
          </h2>
          <p className={`section-subtitle ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Building the future, one dynamic skill at a time.
          </p>
        </div>

        {/* شبكة الفئات */}
        <div className="category-grid">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className={`
                category-card
                ${darkMode 
                  ? 'dark-card hover-dark-shadow' 
                  : 'light-card hover-light-shadow'
                }
              `}
            >

              {/* عنوان الفئة مع شريط متدرج */}
              <h3 className={`category-title ${mapGradientToClass(category.gradient)}`}>
                {category.title}
              </h3>

              {/* حاوية المهارات - تخطيط شبكي مرن */}
              <div className="skills-container">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skillIndex} 
                    className={`
                      skill-item
                      ${darkMode 
                        ? 'dark-skill-bg dark-skill-shadow hover-dark-skill' 
                        : 'light-skill-bg light-skill-shadow hover-light-skill'
                      }
                    `}
                  >
                    {/* طبقة إعادة التعيين لفك الانحراف عن المحتويات */}
                    <div className="skew-reset flex-align-center"> 
                      {/* الأيقونة - نستخدم color مباشرة */}
                      {/* Note: We use inline style for color to match the dynamic Tailwind utility colors */}
                      <i 
                        className={`${skill.icon} skill-icon`} 
                        style={{ color: skill.color.replace('text-','var(--') ? `var(--${skill.color.replace('text-','').replace('-','_')})` : ''}}
                      ></i>
                      
                      {/* اسم المهارة */}
                      <span className={`skill-name ${darkMode ? 'dark-skill-text' : 'light-skill-text'}`}>
                        {skill.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;