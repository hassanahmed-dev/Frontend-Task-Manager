import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Hassan Ahmed Task Management Solution. All rights reserved.</p>
        <span>Built with ❤️ using React and Node.js</span>
      </div>
    </footer>
  );
};

export default Footer; 