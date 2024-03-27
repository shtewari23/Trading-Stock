import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import './CandleStickChart.css';

const CandlestickChart = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [priceLimit, setPriceLimit] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = data.filter(item => item.name.toLowerCase().includes(term.toLowerCase()));
    setFilteredData(filtered);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handlePriceLimitChange = (event) => {
    setPriceLimit(event.target.value);
  };

  const handleBuy = () => {
    console.log('Buy:', quantity, priceLimit);
  };

  const handleSell = () => {
    console.log('Sell:', quantity, priceLimit);
  };

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Stock..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="chart-container">
        {filteredData.map((stock, index) => (
          <div key={index} className="stock-chart">
            <h3>{stock.name}</h3>
            <Chart
              options={{
                chart: {
                  type: 'candlestick',
                  height: 350
                },
                
                hover: {
                    filter: {
                      type: 'none',
                    },
                },

                xaxis: {
                  type: 'datetime'
                },
                yaxis: {
                  tooltip: {
                    enabled: true
                  }
                }
              }}
              series={[{ data: stock.data }]}
              type="candlestick"
              width="100%"
            />
          </div>
        ))}
      </div>
      <div className="trade-panel">
        <div className="input-group">
          <input type="text" placeholder="Quantity" value={quantity} onChange={handleQuantityChange} />
          <input type="text" placeholder="Price Limit" value={priceLimit} onChange={handlePriceLimitChange} />
        </div>
        <div className="button-group">
          <button className="buy-button" onClick={handleBuy}>Buy</button>
          <button className="sell-button" onClick={handleSell}>Sell</button>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChart;
