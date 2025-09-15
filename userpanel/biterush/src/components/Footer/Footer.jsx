import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="minimal-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h5>BiteRush</h5>
            <p>Delicious food, delivered fast</p>
          </div>
          <div className="footer-copyright">
            <p>&copy; 2025 BiteRush. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;