import React, { useState } from 'react';
import './Header.css';

const Header = ({ account, chainId, onConnect, onDisconnect, onSwitchToLocalhost }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId) => {
    switch(chainId) {
      case 1: return 'Ethereum Mainnet';
      case 5: return 'Goerli Testnet';
      case 31337: return 'Localhost';
      default: return `Chain ${chainId}`;
    }
  };

  const isWrongNetwork = chainId && chainId !== 31337;

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-icon">👕</span>
          <span className="logo-text">DressCrypto</span>
        </div>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <a href="#home" className="nav-link">Početna</a>
          <a href="#products" className="nav-link">Dresovi</a>
          <a href="#about" className="nav-link">O nama</a>
          <a href="#contact" className="nav-link">Kontakt</a>
        </nav>

        <div className="header-actions">
          {account ? (
            <div className="wallet-info">
              <div className="network-info">
                <span className={`network-badge ${isWrongNetwork ? 'network-wrong' : 'network-correct'}`}>
                  {chainId ? getNetworkName(chainId) : 'Nepoznata mreža'}
                </span>
                {isWrongNetwork && (
                  <button 
                    className="switch-network-btn"
                    onClick={onSwitchToLocalhost}
                    title="Prebaci na localhost mrežu"
                  >
                    🔄 Localhost
                  </button>
                )}
              </div>
              <div className="wallet-address">{formatAddress(account)}</div>
              <button 
                className="disconnect-btn"
                onClick={onDisconnect}
                title="Disconnekt wallet"
              >
                ⚡ Disconnekt
              </button>
            </div>
          ) : (
            <button 
              className="connect-btn"
              onClick={onConnect}
            >
              🔗 Konektuj Wallet
            </button>
          )}

          <button 
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;