import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import './CandleStickChart.css';
import{ TextField , Modal} from '@mui/material';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Wallet } from '@mui/icons-material'; // Import wallet icon
import Typography from '@mui/material/Typography'; // Import Typography
import PopupMessage from './PopupMessage';
import Confirmidentity from './ConfirmIdentity';
import { useRes } from 'Context';


const CandlestickChart = ({ data }) => {
    const {res,setRes} = useRes();
    const {otpRes,setOtpRes} = useRes();

console.log(res,"777")
    const storedData = sessionStorage.getItem("attributeData");
    const initialData = storedData
        ? JSON.parse(storedData)?.assignedAttributes
        : [];
    const [menuItems, setMenuItems] = useState(initialData);
    const hasSellAccess =
        menuItems &&
        menuItems?.some(
            (attribute) =>
                attribute.attributename === "Sell" && attribute.read === "true"
        );

    const hasBuyAccess =
        menuItems &&
        menuItems?.some(
            (attribute) =>
                attribute.attributename === "Buy" && attribute.read === "true"
        );

    const hasSearchAccess =
        menuItems &&
        menuItems?.some(
            (attribute) =>
                attribute.attributename === "Search" && attribute.read === "true"
        );
        const [openModal, setOpenModal] = useState(false);

    const [selectedStock, setSelectedStock] = useState('');
    const [quantity, setQuantity] = useState('');
    const [priceLimit, setPriceLimit] = useState('');
    const [walletBalance, setWalletBalance] = useState(10000); // Initial balance of 10000 INR
    const [selectedChartData, setSelectedChartData] = useState(null); // Selected chart data
    const [boughtStocks, setBoughtStocks] = useState([]); // Array to store bought stocks
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [ sell , setSell] = useState(0)
    const [ buy, setBuy] = useState(0)
    const handleLoginWithAxiom = async (e) => {
      try {
        const client_id = process.env.REACT_APP_OIDC_CLIENT_ID;
        const scope = "openid profile";
        const response_type = "code";
        const anchorTg = document.createElement("a");
        anchorTg.href = `https://openid.axiomprotect.com/oidc/authorize?client_id=${client_id}&scope=${scope}&response_type=${response_type}&response_mode=query&redirect_uri=${window.location.protocol}//${window.location.host}/dashboard/default`;
        document.body.appendChild(anchorTg);
        anchorTg.click();
  
        const token = generateToken();
        localStorage.setItem("custom-auth-token", token);
        // Handle success
      } catch (err) {
        console.error(err);
        // Handle error
      }
    };
    const handleOpenModal = () => {
      setOpenModal(true);
    };
  
    // Close the modal
    const handleCloseModal = () => {
      setOpenModal(false);
    };
  
    const handlePopupClose = () => {
        setPopupOpen(false);
    };

    const handleStockChange = (event) => {
        setSelectedStock(event.target.value);
        // Find data for the selected stock
        const selectedData = data.find(stock => stock.name === event.target.value);
        setSelectedChartData(selectedData);
    };

    
    useEffect(()=>{
if(res === 0 & buy === 1){
    setOpenModal(false)
    console.log("101",openModal)
    const totalPrice = parseFloat(priceLimit) * parseFloat(quantity);
    if (totalPrice <= walletBalance) {
        // Sufficient balance, update wallet and add bought stock
        const existingStockIndex = boughtStocks.findIndex(stock => stock.name === selectedStock);
        if (existingStockIndex !== -1) {
            // Stock already exists, update quantity and price
            const updatedStocks = [...boughtStocks];
            updatedStocks[existingStockIndex].quantity += parseInt(quantity);
            updatedStocks[existingStockIndex].totalPrice += parseFloat(totalPrice);
            setBoughtStocks(updatedStocks);
            // navigate('/ConfirmedIdentity');

        } else {
            // Stock doesn't exist, add new bought stock
            const newBoughtStock = {
                name: selectedStock,
                quantity: parseInt(quantity),
                price: parseFloat(priceLimit),
                totalPrice: parseFloat(totalPrice)
            };
            setBoughtStocks([...boughtStocks, newBoughtStock]);
        }
        setWalletBalance(walletBalance - totalPrice);
        setPopupTitle('Stock Bought Successfully');
        setPopupMessage(`You have successfully bought ${quantity} shares of ${selectedStock}.`);
        setPopupOpen(true);
        console.log('Buy:', quantity, totalPrice, selectedStock);
    } else {
        // Insufficient balance, display a popup
        setPopupTitle('Insufficient Balance');
        setPopupMessage('You do not have sufficient balance to buy this stock.');
        setPopupOpen(true);
    }
 
}


else{
    setOpenModal(false);
    console.log("dd")

}
   setRes() 
},[res])
useEffect(() => {
    if (res === 0 && sell === 1) {
        // Handle Sell Logic
        const totalPrice = parseFloat(priceLimit) * parseFloat(quantity);
        const existingStockIndex = boughtStocks.findIndex(
            (stock) => stock.name === selectedStock
        );

        if (existingStockIndex === -1 || boughtStocks[existingStockIndex].quantity < quantity) {
            // Stock not owned or not enough quantity to sell
            setPopupTitle('Cannot Sell Stock');
            setPopupMessage(`You do not own enough shares of ${selectedStock} to sell.`);
            setPopupOpen(true);
        } else {
            // Sufficient stock, proceed with sell operation
            const updatedStocks = [...boughtStocks];
            const stockToSell = updatedStocks[existingStockIndex];

            stockToSell.quantity -= parseInt(quantity);
            stockToSell.totalPrice -= totalPrice;

            if (stockToSell.quantity === 0) {
                // Remove the stock if no quantity is left
                updatedStocks.splice(existingStockIndex, 1);
            }

            setBoughtStocks(updatedStocks);
            setWalletBalance(walletBalance + totalPrice);

            setPopupTitle('Stock Sold Successfully');
            setPopupMessage(`You have successfully sold ${quantity} shares of ${selectedStock}.`);
            setPopupOpen(true);
        }

        setOpenModal(false);
        setSell(0); // Reset the sell flag
    }
}, [res, sell]);


  function generateToken() {
    const arr = new Uint8Array(12);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (v) => v.toString(16).padStart(2, "0")).join("");
  }

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handlePriceLimitChange = (event) => {
        setPriceLimit(event.target.value);
    };

    const handleBuy = () => {
      setOpenModal(true);
setBuy(1);

    };

    const handleSell = () => {
      setOpenModal(true);
      setSell(1);

    }

   
    const isStockSelected = selectedStock !== '';

    return (
        <div className="container">
            <div className="wallet-section">
                <Wallet fontSize="large" style={{ marginRight: '8px', color:'#86d8ed' }} />
                <Typography variant="h6" style={{ marginRight: '8px' }}>Wallet: {walletBalance} INR</Typography>            </div>
            <div className="search-bar">
                <TextField
                    id="outlined-basic"
                    select
                    label="Select Stock"
                    variant="outlined"
                    value={selectedStock}
                    onChange={handleStockChange}
                    disabled={!hasSearchAccess}
                    style={{ marginLeft: "4px", width: '100%' }}
                >
                    {['Reliance', 'Axis Bank Ltd', 'Bajaj-Auto'].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            <div className="trade-panel">
                <TextField
                    label="Price Limit"
                    variant="outlined"
                    value={priceLimit}
                    onChange={handlePriceLimitChange}
                    style={{ marginLeft: '10px', width: "42%", backgroundColor: "white" }}
                    size="small"
                    disabled={!isStockSelected}
                />
                <TextField
                    label="Quantity"
                    variant="outlined"
                    value={quantity}
                    onChange={handleQuantityChange}
                    style={{ marginLeft: '10px', width: "42%", backgroundColor: "white" }}
                    size="small"
                    disabled={!isStockSelected}
                />
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleBuy}
                    style={{ marginLeft: '10px' }}
                    disabled={!hasBuyAccess || !isStockSelected}
                >
                    Buy
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleSell}
                    style={{ marginLeft: '10px' }}
                    disabled={!hasSellAccess || !isStockSelected}
                >
                    Sell
                </Button>
            </div>
            <div className="chart-container">
                {selectedChartData && (
                    <div className="stock-chart">
                        <h3>{selectedChartData.name}</h3>
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
                            series={[{ data: selectedChartData.data }]}
                            type="candlestick"
                            width="100%"
                        />
                    </div>
                )}
            </div>
            <div className="table-container">
                <Table style ={{backgroundColor:"#86d8ed" , marginTop:'18px' ,borderRadius: '10px'
}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Stock Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Total Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody  style ={{backgroundColor:"#aee4f2"}}>
                        {boughtStocks.map((stock, index) => (
                            <TableRow key={index}>
                                <TableCell>{stock.name}</TableCell>
                                <TableCell>{stock.quantity}</TableCell>
                                <TableCell>{stock.totalPrice}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <PopupMessage open={popupOpen} onClose={handlePopupClose} title={popupTitle} message={popupMessage} />
            <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div
          style={{
            position: "absolute",
            width: "850px",
            height: "600px",
            backgroundColor: "white",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            outline: "none",
            borderRadius: 8,
            padding: 20,
          }}
        >
          <Confirmidentity  setOpenModal={setOpenModal}/>
        </div>
      </Modal>
        </div>
    );
};

export default CandlestickChart;
