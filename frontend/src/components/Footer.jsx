import React from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaLocationArrow, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./Footer.css";

const Footer = () => {
  const hours = [
    { id: 1, day: "Monday - Thursday", time: "09:00 AM - 10:00 PM" },
    { id: 2, day: "Friday", time: "03:00 PM - 09:00 PM" },
    { id: 3, day: "Saturday - Sunday", time: "10:00 AM - 08:00 PM" },
  ];

  return (
    <footer className="footer">
      <div className="footer-overlay">
        <div className="footer-container">
          <div className="footer-grid">

            {/* Brand Section */}
            <div className="footer-section">
              <img src="/logo.png" alt="logo" className="footer-logo" />
              <p className="footer-description">
                Dedicated to providing world-class healthcare with a personal touch in the heart of Amman.
              </p>
              <div className="social-icons">
                <a href="#"><FaFacebook /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaLinkedin /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/appointment">Appointment</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>

            {/* Hours Section */}
            <div className="footer-section">
              <div className="hours-header">
                <h3>Opening Hours ساعات الدوام</h3>
              </div>
              <ul className="hours-list">
                {hours.map((item) => (
                  <li key={item.id}>
                    <span className="day">{item.day}</span>
                    <span className="time">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="footer-section">
              <h3>Contact Info</h3>
              <div className="contact-details">
                <div className="contact-card">
                  <FaPhone className="icon" />
                  <span>+962 799 52 7171</span>
                </div>
                <div className="contact-card">
                  <MdEmail className="icon" />
                  <span>info@healthcare.com</span>
                </div>
                <div className="contact-card">
                  <FaLocationArrow className="icon" />
                  <span>Amman, Dahyat Al-Yasmin</span>
                </div>
              </div>
            </div>

          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} YourClinic. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
