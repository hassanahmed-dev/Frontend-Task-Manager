import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <div className="spinner-outer">
          <div className="spinner-inner">
            <div className="logo-effect">
              <span className="dot dot1"></span>
              <span className="dot dot2"></span>
              <span className="dot dot3"></span>
              <span className="dot dot4"></span>
              <span className="dot dot5"></span>
            </div>
          </div>
        </div>
        <p className="loading-text">Loading<span className="loading-dots"><span>.</span><span>.</span><span>.</span></span></p>
      </div>
    </div>
  );
};

export default Loader; 