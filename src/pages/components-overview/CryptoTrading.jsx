import React, { useState } from 'react';
import './CryptoTrading.css'; // Import CSS file for styling

const CryptoTrading = () => {
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);

  const handleCryptoChange = (event) => {
    const { value } = event.target;
    setCryptoAmount(value);
    setUsdAmount(value * 50000); // Assuming 1 crypto = $50000
  };

  const handleUsdChange = (event) => {
    const { value } = event.target;
    setUsdAmount(value);
    setCryptoAmount(value / 50000); // Assuming 1 crypto = $50000
  };

  return (
    <div className="crypto-trading-container">
      <h2 className="crypto-trading-heading">Crypto Trading</h2>
      <div className="crypto-trading-form">
        <div className="form-group">
          <label htmlFor="cryptoAmount">Amount of Cryptocurrency:</label>
          <input
            type="number"
            id="cryptoAmount"
            value={cryptoAmount}
            onChange={handleCryptoChange}
            placeholder="Enter amount"
          />
        </div>
        <div className="form-group">
          <label htmlFor="usdAmount">Equivalent USD Amount:</label>
          <input
            type="number"
            id="usdAmount"
            value={usdAmount}
            onChange={handleUsdChange}
            placeholder="Enter amount"
          />
        </div>
      </div>
      <div className="crypto-trading-info">
        <p>Current Crypto Price: $50,000</p>
        <p>Transaction Fee: 0.5%</p>
      </div>
      <button className="trade-button">Trade Now</button>
    </div>
  );
};

export default CryptoTrading;
