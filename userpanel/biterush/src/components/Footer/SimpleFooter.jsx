import React from 'react';

const SimpleFooter = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      borderTop: '3px solid #ff6b35',
      padding: '2rem 0',
      marginTop: '3rem',
      color: 'white'
    }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h5 style={{color: '#ff6b35', fontWeight: 'bold', marginBottom: '0.5rem'}}>BiteRush</h5>
            <p style={{color: '#bdc3c7', margin: 0}}>Delicious food, delivered fast</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p style={{color: '#95a5a6', margin: 0, fontSize: '0.9rem'}}>
              &copy; 2025 BiteRush. All rights reserved.
            </p>
            <div className="mt-2">
              <a href="mailto:anshmore1440@gmail.com" 
                 style={{color: '#f7931e', textDecoration: 'none', marginRight: '20px'}}>
                Gmail
              </a>
              <a href="https://github.com/ansh1440" 
                 style={{color: '#f7931e', textDecoration: 'none', marginRight: '20px'}}>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/ansh-more-1316b522b/" 
                 style={{color: '#f7931e', textDecoration: 'none'}}>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;