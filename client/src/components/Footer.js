import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-main">
          
          <div className="footer-section brand-section">
            <div className="footer-logo">
              <span className="footer-logo-icon">👕</span>
              <span className="footer-logo-text">DressCrypto</span>
            </div>
            <p className="footer-description">
              Prva blockchain platforma za kupovinu ekskluzivnih fudbalskih dresova. 
              Sigurno, brzo i transparentno putem Ethereum mreže.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter">
                <span>🐦</span>
              </a>
              <a href="#" className="social-link" aria-label="Discord">
                <span>💬</span>
              </a>
              <a href="#" className="social-link" aria-label="Telegram">
                <span>✈️</span>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <span>🐙</span>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Brzi linkovi</h3>
            <ul className="footer-links">
              <li><a href="#home">Početna</a></li>
              <li><a href="#products">Dresovi</a></li>
              <li><a href="#about">O nama</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Kontakt</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Blockchain</h3>
            <ul className="footer-links">
              <li><a href="#smart-contract">Smart Contract</a></li>
              <li><a href="#how-it-works">Kako funkcioniše</a></li>
              <li><a href="#metamask-guide">MetaMask vodič</a></li>
              <li><a href="#gas-fees">Gas fees</a></li>
              <li><a href="#security">Bezbednost</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Podrška</h3>
            <ul className="footer-links">
              <li><a href="#terms">Uslovi korišćenja</a></li>
              <li><a href="#privacy">Privatnost</a></li>
              <li><a href="#returns">Povraćaj</a></li>
              <li><a href="#shipping">Dostava</a></li>
              <li><a href="#support">Tehnička podrška</a></li>
            </ul>
          </div>

        </div>

        <div className="newsletter-section" id="contact">
          <div className="newsletter-content">
            <h3 className="newsletter-title">
              📧 Pretplati se na newsletter
            </h3>
            <p className="newsletter-description">
              Budi prvi koji će saznati o novim dresovima i specijalnim ponudama!
            </p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Unesite vašu email adresu"
                className="newsletter-input"
              />
              <button className="newsletter-button">
                Pretplati se
              </button>
            </div>
          </div>
        </div>

        <div className="blockchain-stats">
          <div className="stat-item">
            <span className="stat-icon">⛓️</span>
            <div className="stat-info">
              <div className="stat-value">Ethereum</div>
              <div className="stat-label">Blockchain mrežaa</div>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">🔒</span>
            <div className="stat-info">
              <div className="stat-value">100%</div>
              <div className="stat-label">Bezbedno</div>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <div className="stat-info">
              <div className="stat-value">~15s</div>
              <div className="stat-label">Vreme transakcije</div>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">🌍</span>
            <div className="stat-info">
              <div className="stat-value">Globalno</div>
              <div className="stat-label">Dostupno svuda</div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>© {currentYear} DressCrypto. Sva prava zadržana.</p>
            </div>
            
            <div className="footer-bottom-links">
              <a href="#terms">Uslovi</a>
              <a href="#privacy">Privatnost</a>
              <a href="#cookies">Cookies</a>
            </div>
            
            <div className="powered-by">
              <span>Pokretano sa</span>
              <div className="tech-stack">
                <span className="tech-item">⟠ Ethereum</span>
                <span className="tech-item">⚛️ React</span>
                <span className="tech-item">🦄 MetaMask</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;