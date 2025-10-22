import React from 'react';
import './HappyCustomers.css';

const HappyCustomers = () => {
  return (
    <section className="happy-customers">
      <div className="happy-customers-container">
        <h2 className="happy-customers-title">Zadovoljni Kupci</h2>
        <p className="happy-customers-subtitle">Pogledaj šta naši kupci kažu o DressCrypto dresovima!</p>
        <div className="customer-list">
          <div className="customer-card">
            <span className="customer-emoji">😃</span>
            <h3 className="customer-name">Marko P.</h3>
            <p className="customer-review">"Dres je stigao brzo, kvalitet je vrhunski! Sve preporuke."</p>
          </div>
          <div className="customer-card">
            <span className="customer-emoji">🤩</span>
            <h3 className="customer-name">Jovana S.</h3>
            <p className="customer-review">"Kupovina preko blockchaina je bila baš jednostavna. Dres je original!"</p>
          </div>
          <div className="customer-card">
            <span className="customer-emoji">👍</span>
            <h3 className="customer-name">Ivan D.</h3>
            <p className="customer-review">"Sigurna i brza transakcija, dres je kao sa slike!"</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HappyCustomers;
