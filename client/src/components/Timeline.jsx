import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, MapPin, Award } from 'lucide-react';
// Import the new CSS file

const Timeline = ({ darkMode }) => {
    const timelineData = [
        {
            type: 'education',
            title: 'Software Engineering & Information Systems Degree',
            company: 'FSTSBZ - Faculté des Sciences et Techniques de Sidi Bouzid',
            location: 'Sidi Bouzid, Tunisia',
            period: '2023 - 2026 (Expected)',
            description: 'Focused on advanced software engineering principles, database systems (MongoDB), and modern web application development. Graduated with a Very Good (Très Bien) distinction.',
            achievements: [
                'Academic Honor: Graduated with a "Very Good" (Très Bien) distinction in Software Engineering.',
                'Competitive Experience: Participated in 3 Coding Competitions (Hackathons), focusing on Cybersecurity and completing complex projects within a 24-hour timeframe.',
                'Skill Development: Developed strong Effective Time Management skills and the ability to perform under high pressure to deliver integrated projects.',
            ]
        },
        {
            type: 'work',
            title: 'Lead Full Stack Developer & AI Integrator (Freelance)',
            company: '10+ Major Projects (Self-Developed)',
            location: 'Remote/Tunisia',
            period: '2023 - Present',
            description: 'Designed, developed, and deployed over 10 full-stack applications using the MERN Stack and MongoDB, applying best practices across the full software development lifecycle (SDLC).',
            achievements: [
                'DevOps & CI/CD: Established Continuous Integration/Continuous Deployment (CI/CD) pipelines using GitHub, Vercel (Backend), and Firebase (Frontend) for automated and rapid deployment.',
                'Artificial Intelligence (AI): Built and deployed a custom TensorFlow model for image background removal (trained on 10,000 images with 95% accuracy), distributed via Docker.',
                'Real-Time Systems: Implemented robust real-time notification architecture to alert users/administrators on mobile devices regarding new product requests.',
            ]
        },
        {
            type: 'education',
            title: 'Baccalaureate Diploma (High School Graduation)',
            company: 'High School',
            location: 'Tunisia',
            period: '2022',
            description: 'Successfully obtained the Baccalaureate Diploma, providing a strong foundation for higher technical studies in computer science.',
            achievements: [
                'Successfully passed the Baccalaureate exam',
                'Prepared for higher technical studies'
            ]
        },
    ];

    return (
        <section id="timeline" className={`timeline-section ${darkMode ? 'dark' : ''}`}>
            <div className="timeline-container">
                <div className="timeline-header">
                    <h2>
                        My <span className="gradient-text">Journey</span>
                    </h2>
                    <p>
                        My professional and educational milestones
                    </p>
                </div>

                <div className="timeline-wrapper">
                    <div className="timeline-content">
                        {timelineData.map((item, index) => {
                            const isWork = item.type === 'work';
                            const isReverse = index % 2 !== 0;
                            
                            // Determine class names for desktop layout
                            const itemClasses = `timeline-item ${isReverse ? 'reverse' : ''}`;
                            const contentClasses = `timeline-card-wrapper ${isReverse ? 'align-left' : 'align-right'}`;
                            const dotClasses = `timeline-item-dot ${isWork ? 'dot-work' : 'dot-education'}`;
                            const badgeClasses = `badge ${isWork ? 'work' : 'education'}`;
                            
                            return (
                                <div key={index} className={itemClasses}>
                                    
                                    {/* Timeline Dot (Hidden on mobile via CSS) */}
                                    <div className={dotClasses} />

                                    {/* Content Card */}
                                    <div className={contentClasses}>
                                        <div className="timeline-card">
                                            
                                            {/* Type Badge */}
                                            <div className={badgeClasses}>
                                                <Award className="badge-icon" />
                                                {isWork ? 'Work Experience' : 'Education'}
                                            </div>

                                            <h3 className="timeline-card-title">
                                                {item.title}
                                            </h3>

                                            <div className="timeline-card-company">
                                                {item.company}
                                            </div>

                                            <div className="detail-row">
                                                <div className="detail-item">
                                                    <Calendar className="detail-icon" />
                                                    <span>{item.period}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <MapPin className="detail-icon" />
                                                    <span>{item.location}</span>
                                                </div>
                                            </div>

                                            <p className="timeline-card-description">
                                                {item.description}
                                            </p>

                                            {/* Achievements Section */}
                                            <div className="achievement-card">
                                                <h4 className="achievement-card-title">
                                                    Key Achievements:
                                                </h4>
                                                <ul className="achievement-list">
                                                    {item.achievements.map((achievement, achievementIndex) => (
                                                        <li key={achievementIndex} className="achievement-item">
                                                            <Award className="achievement-item-icon" /> 
                                                            <span className="flex-1">
                                                                {achievement}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {/* End Achievements Section */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

Timeline.propTypes = {
    darkMode: PropTypes.bool.isRequired,
};

export default Timeline;