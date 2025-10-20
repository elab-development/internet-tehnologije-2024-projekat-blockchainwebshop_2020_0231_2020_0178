import React from 'react';
import './About.css';

const About = () => {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-header">
          <h2 className="about-title">
            O <span className="highlight">Nama</span>
          </h2>
          <div className="about-divider"></div>
        </div>

        <div className="about-content">
          <div className="about-text">
            <h3>🏆 Revolucija u Online Trgovini Dresova</h3>
            <p>
              Dobrodošli u <strong>DressCrypto</strong> - prvu decentralizovanu platformu za kupovinu 
              fudbalskih dresova koja koristi blockchain tehnologiju. Kombinujemo strast prema sportu 
              sa inovativnom Web3 tehnologijom.
            </p>

            <h3>⚡ Zašto Blockchain?</h3>
            <p>
              Koristimo <strong>Ethereum blockchain</strong> i <strong>smart contract-e</strong> kako bismo 
              osigurali potpunu transparentnost, sigurnost i decentralizaciju svakih transakcija. 
              Sve kupovine su zapisane na blockchain-u i ne mogu biti izmenjene.
            </p>

            <div className="about-features">
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <div>
                  <h4>Potpuna Sigurnost</h4>
                  <p>Smart contract-i garantuju bezbedne transakcije bez posrednika</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">💎</span>
                <div>
                  <h4>Transparentnost</h4>
                  <p>Sve transakcije su javne i proverljive na blockchain-u</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <div>
                  <h4>Trenutne Transakcije</h4>
                  <p>Plaćanje kriptovalutama za sekundama umesto dana</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🌍</span>
                <div>
                  <h4>Globalna Dostupnost</h4>
                  <p>Kupuj dresove bilo gde u svetu sa MetaMask wallet-om</p>
                </div>
              </div>
            </div>

           
           

            <h3>👥 Naš Tim</h3>
            <p>
              Projekat je razvijen od strane studenata <strong>E-LAB</strong> fakulteta 
              kao deo kursa <strong>Internet Tehnologije 2024</strong>.
            </p>
            <div className="team-info">
              <div className="team-member">
                <span className="member-badge">👨‍💻</span>
                <p><strong>Student 1</strong> - 2020/0231</p>
                <p>Smart Contracts & Backend</p>
              </div>
              <div className="team-member">
                <span className="member-badge">👨‍💻</span>
                <p><strong>Student 2</strong> - 2020/0178</p>
                <p>Frontend & Web3 Integration</p>
              </div>
            </div>

            <div className="about-cta">
              <a href="#products" className="cta-button">
                🛍️ Pogledaj Proizvode
              </a>
              <a 
                href="https://github.com/elab-development/internet-tehnologije-2024-projekat-blockchainwebshop_2020_0231_2020_0178" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-button secondary"
              >
                💻 GitHub Repo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
