import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react";
// Import the new CSS file

const Contact = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! I'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section id="contact" className={`contact-section ${darkMode ? "dark" : ""}`}>
      <div className="contact-container">
        <div className="contact-header">
          <h2>
            Get In{" "}
            <span className="gradient-text">
              Touch
            </span>
          </h2>
          <p>
            Ready to start your next project? Let's work together to create something
            amazing.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Information */}
          <div>
            <div className="contact-card">
              <h3>
                Let's Connect
              </h3>

              <p>
                I'm always interested in new opportunities and exciting projects. Whether
                you have a question or just want to say hi, feel free to reach out!
              </p>

              <div className="info-section">
                <div className="info-item">
                  <div className="info-icon-wrapper icon-mail">
                    <Mail size={20} />
                  </div>
                  <div className="info-details">
                    <h4>
                      Email
                    </h4>
                    <p>
                      kmejri57@gmail.com
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-wrapper icon-phone">
                    <Phone size={20} />
                  </div>
                  <div className="info-details">
                    <h4>
                      Phone
                    </h4>
                    <p>
                      +216 96 086 581
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-wrapper icon-map">
                    <MapPin size={20} />
                  </div>
                  <div className="info-details">
                    <h4>
                      Location
                    </h4>
                    <p>
                      Tunis, Ben Arous, Fouchena
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="social-links-section">
                <h4>
                  Follow Me
                </h4>
                <div className="social-links-container">
                  <a
                    href="#"
                    className="social-link github"
                  >
                    <Github size={20} />
                  </a>
                  <a
                    href="#"
                    className="social-link linkedin"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href="#"
                    className="social-link twitter"
                  >
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="contact-card">
              <h3>
                Send Message
              </h3>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="form-field">
                    <label>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Project inquiry"
                  />
                </div>

                <div className="form-field">
                  <label>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="submit-button group"
                >
                  <span>Send Message</span>
                  <Send
                    size={18}
                    className="send-icon"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};




export default Contact;