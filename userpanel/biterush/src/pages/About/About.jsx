import React from 'react';

const About = () => {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{color: '#ff6b35'}}>About BiteRush</h2>
            <p className="lead text-muted">Your favorite food, delivered fresh and fast</p>
          </div>
          
          <div className="card shadow-sm mb-4" style={{borderRadius: '12px', border: 'none'}}>
            <div className="card-body p-4">
              <p className="mb-4" style={{fontSize: '1.1rem', lineHeight: '1.7'}}>
                BiteRush is a modern food delivery platform that connects you with the best restaurants in your area. 
                We make ordering food simple, fast, and enjoyable.
              </p>
              
              <div className="row">
                <div className="col-md-6 mb-4">
                  <h5 style={{color: '#ff6b35', marginBottom: '15px'}}>What We Offer</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">🍕 Wide variety of cuisines</li>
                    <li className="mb-2">🔒 Secure payment options</li>
                    <li className="mb-2">📱 Easy online ordering</li>
                    <li className="mb-2">🚚 Fast delivery service</li>
                  </ul>
                </div>
                
                <div className="col-md-6 mb-4">
                  <h5 style={{color: '#ff6b35', marginBottom: '15px'}}>How It Works</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">1. Browse restaurants</li>
                    <li className="mb-2">2. Select your favorites</li>
                    <li className="mb-2">3. Place your order</li>
                    <li className="mb-2">4. Enjoy your meal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card shadow-sm" style={{
            borderRadius: '12px', 
            border: 'none',
            background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
            color: 'white'
          }}>
            <div className="card-body p-4 text-center">
              <h5 className="mb-3">Built With Modern Technology</h5>
              <p className="mb-3">React.js • Spring Boot • MySQL</p>
              <p className="mb-0" style={{fontSize: '0.9rem', opacity: '0.9'}}>
                Designed for speed, security, and great user experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;