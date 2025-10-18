import React from 'react';
import './Hero.css';

const Hero = ({ onShopNow }) => {
  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Ekskluzivni <span className="highlight">Dresovi</span>
              <br />
              Kupljeni sa <span className="crypto-highlight">Kriptovalutama</span>
            </h1>
            
            <p className="hero-description">
              Otkrijte našu kolekciju premium dresova za fudbal. 
              Plaćajte sigurno i anonimno koristeći Ethereum blockchain. 
              Brza dostava širom sveta, autentičnost garantovana.
            </p>
            
            <div className="hero-features">
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>Blockchain sigurnost</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Instant plaćanje</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🌍</span>
                <span>Globalna dostava</span>
              </div>
            </div>
            
            <div className="hero-actions">
              <button 
                className="cta-button primary"
                onClick={onShopNow}
              >
                🛒 Pogledaj Dresove
              </button>
              
              <button className="cta-button secondary">
                📖 Saznaj više
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="jersey-showcase">
              <div className="jersey jersey-1">
                <div className="jersey-front">👕</div>
                <div className="jersey-number">10</div>
              </div>
              <div className="jersey jersey-2">
                <div className="jersey-front">👕</div>
                <div className="jersey-number">7</div>
              </div>
              <div className="jersey jersey-3">
                <div className="jersey-front">👕</div>
                <div className="jersey-number">9</div>
              </div>
            </div>
            
            <div className="crypto-indicators">
              <div className="crypto-badge">
                <span className="crypto-symbol">⟠</span>
                <span>ETH</span>
              </div>
            
            </div>
          </div>
        </div>
        
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">500+</div>
            <div className="stat-label">Zadovoljnih kupaca</div>
          </div>
          <div className="stat">
            <div className="stat-number">100+</div>
            <div className="stat-label">Različitih dresova</div>
          </div>
          <div className="stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Blockchain podrška</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;