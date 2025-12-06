import React from 'react';
// Assuming 'lucide-react' icons are still available or you replace them with standard image/svg
import { Code, Lightbulb, Rocket, Users } from 'lucide-react';

const About = ({ darkMode }) => {
  const features = [
    {
      icon: <Code className="feature-icon" />,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and efficient code following best practices and industry standards."
    },
    {
      icon: <Lightbulb className="feature-icon" />,
      title: "Problem Solver",
      description: "Passionate about solving complex problems with creative and innovative solutions."
    },
    {
      icon: <Rocket className="feature-icon" />,
      title: "Fast Delivery",
      description: "Committed to delivering high-quality projects on time with attention to detail."
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Team Player",
      description: "Excellent communication skills and experience working in collaborative environments."
    }
  ];

  return (
    <section id="about" className={`about-section ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="container">
        <div className="text-center section-header">
          <h2 className={`section-title ${darkMode ? 'dark-text' : 'light-text'}`}>
            About <span className="highlight-text">Me</span>
          </h2>
          <p className={`section-subtitle ${darkMode ? 'dark-subtitle' : 'light-subtitle'}`}>
            Passionate full-stack developer with a love for creating beautiful, functional, and user-centered digital experiences.
          </p>
        </div>

        <div className="grid-layout">
          {/* Bio Section */}
          <div>
            <div className={`bio-card ${darkMode ? 'dark-card' : 'light-card'}`}>
              <h3 className={`bio-title ${darkMode ? 'dark-text' : 'light-text'}`}>
                My Story
              </h3>
              <p className={`bio-paragraph ${darkMode ? 'dark-paragraph' : 'light-paragraph'}`}>
                I'm a dedicated full-stack developer with over 3 years of experience in creating web applications 
                that combine beautiful design with robust functionality. My journey began with a curiosity about 
                how websites work, which evolved into a passion for building digital solutions that make a difference.
              </p>
              <p className={`bio-paragraph mb-6 ${darkMode ? 'dark-paragraph' : 'light-paragraph'}`}>
                I specialize in modern JavaScript frameworks, backend technologies, and database design. 
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, 
                or sharing knowledge with the developer community.
              </p>
              
              <div className="tag-container">
              
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${darkMode ? 'dark-card' : 'light-card'}`}
              >
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h4 className={`feature-title ${darkMode ? 'dark-text' : 'light-text'}`}>
                  {feature.title}
                </h4>
                <p className={`feature-description ${darkMode ? 'dark-description' : 'light-description'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;