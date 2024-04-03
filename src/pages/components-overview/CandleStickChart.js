import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import './CandleStickChart.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
const roleAttributes = [
  {
      "read": "false",
      "attributename": "trading",
      "write": "true"
  },
]
const CandlestickChart = ({ data }) => {
  const hasTradingAccess = roleAttributes.some(attribute => attribute.attributename === 'trading' && attribute.read === 'true');

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
      {hasTradingAccess ? (
        <>
      <div className="search-bar">
      
        <TextField id="outlined-basic" label="Search Stock ..." variant="outlined" value={searchTerm}
         
          onChange={handleSearch} 
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          
          style={{marginLeft:"4px" , width:'100%'}} />
      </div>
      <div className="trade-panel">

         

          <TextField label="Price Limit" variant="outlined"
          value={priceLimit} onChange={handlePriceLimitChange} 
          style ={{ marginLeft:'10px' , width:"42%" ,backgroundColor:"white"} }
          size = "small"
            />
             <TextField label="Quantity" variant="outlined"
          value={quantity} onChange={handleQuantityChange} 
          style ={{ marginLeft:'10px' , width:"42%" , backgroundColor:"white"}}
                    size="small"

            />

          <Button variant="contained" color="success" onClick ={handleBuy}           style ={{ marginLeft:'10px' } }
> 
  Buy
</Button>
<Button variant="contained" color="error" onClick ={handleSell}  style ={{ marginLeft:'10px' } }>  
Sell</Button>      </div>
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
      </>
      ):(
        <h2>
          You dont have access
        </h2>
      )
}
    </div>
  );
};

export default CandlestickChart;
