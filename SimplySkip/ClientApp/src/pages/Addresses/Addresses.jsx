import React, { useState, useEffect } from "react";
import './Addresses.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import { useNavigate, useParams } from "react-router-dom";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import handleHttpRequest from "../../api/api";
import AddressCard from "../../components/AddressCard/AddressCard";
import { Typography, CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Addresses() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [addressesWithCounts, setAddressesWithCounts] = useState([]);
    const [customer, setCustomer] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);

    useEffect(() => {
        handleFetchAddressesWithCounts();
        handleFetchCustomer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFetchAddressesWithCounts = async () => {
        try {
            setIsLoading(true);

            const url = `/booking/customer/${id}/addresses/counts`;
            const method = 'GET';

            const { success, data } = await handleHttpRequest(url, method);

            if (success) {
                setAddressesWithCounts(data);
            } else {
                setSnackbarMessage('Failed to load customer addresses.');
                setShowSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('An error occurred while loading customer addresses.');
            setShowSnackbar(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage('');
        setSnackbarSuccess(false)
    };

    const handleFetchCustomer = async () => {
        try {
            const url = `/customer/${id}`;
            const method = 'GET';

            const { success, data } = await handleHttpRequest(url, method);

            if (success) {
                setCustomer(data);
            } else {
                setSnackbarMessage('Failed to load customer.');
                setShowSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('An error occurred while loading customer.');
            setShowSnackbar(true);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToAddressBookings = (address) => {
        navigate(`/Customer/${id}/Bookings`, { 
            state: { filterAddress: address } // Pass the address to in order to filter bookings in CustomerBookings component.
        });
    };

    const handleBackToCustomer = () => {
        // Navigate back to the Customers page with state indicating to open the modal
        navigate('/Customers', { 
            state: { 
                openCustomerModal: true,
                customerId: id 
            }
        });
    };

    return (
        <>
            <CustomNavbar currentPage={'Διευθύνσεις'} />
            <div className='addresses-container'>
                <div className="addresses-header">
                    <IconButton 
                        onClick={handleBackToCustomer}
                        sx={{ 
                            color: '#006d77', 
                            marginRight: '10px',
                            '&:hover': { 
                                backgroundColor: 'rgba(0, 109, 119, 0.1)' 
                            }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography 
                        sx={{ 
                            color: '#006d77', 
                            fontSize: '20px', 
                            fontWeight: '500'
                        }}
                    >
                        {`${customer.firstName || ''} ${customer.lastName || ''}`}
                    </Typography>
                </div>
                <div className="addresses-section">
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', width: '100%' }}>
                            <CircularProgress size={40} sx={{ color: '#006d77' }} />
                        </div>
                    ) :   
                    Array.isArray(addressesWithCounts) && addressesWithCounts.length > 0 ? addressesWithCounts
                        .sort((a, b) => a.address.localeCompare(b.address))
                        .map((item, index) => (
                            <AddressCard
                                key={index}
                                address={item.address}
                                bookingCount={item.count}
                                onClick={() => navigateToAddressBookings(item.address)}
                            />
                    )) : null}
                </div>
            </div>
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity={snackbarSuccess ? 'success' : 'error' } />
        </>
    );
}

export default Addresses;