import React, { useState, useEffect } from "react";
import './Customers.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomerCard from "../../components/CustomerCard/CustomerCard";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, Typography } from "@mui/material";
import CustomButton from "../../components/CustomButton/CustomButton";

function Customers() {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [openViewCustomer, setOpenViewCustomer] = useState(false);
    const [customer, setCustomer] = useState({});

    useEffect(() => {
        handleFetchCustomers();
        // eslint-disable-next-line
    }, []);

    const handleFetchCustomers = async () => {
        const response = await fetch("https://localhost:7197/customer/", {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const data = await response.json();

            setCustomers(data);
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleEditClick = (customerId) => {
        navigate(`/Customer/${customerId}`);
    }

    const handleViewBookings = (customerId) => {
        navigate(`/Customer/${customerId}/Bookings`);
    }

    const handleOpenViewCustomer = (customer) => {
        setCustomer(customer);
        setOpenViewCustomer(true);
    }
    const handleCloseViewCustomer = () => setOpenViewCustomer(false);

    const filteredCustomers = customers.filter((customer) =>
        customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <CustomNavbar currentPage={'Customers'} addNewClick={'/Customer'} />
            <div className='customers-container'>
                <CustomTextField
                    label={'Search...'}
                    variant={'standard'}
                    type={'search'}
                    width={'500px'}
                    margin={'normal'}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    display={filteredCustomers.length > 0 ? '' :  'none'}
                />
                <div className="customers-section">
                    {Array.isArray(filteredCustomers) && filteredCustomers.length > 0 ? filteredCustomers.sort((a, b) => a.lastName.localeCompare(b.lastName)).map((customer) => (
                        <CustomerCard
                            key={customer.id}
                            statusBorder={'10px solid #83c5be'}
                            lastName={customer.lastName}
                            firstName={customer.firstName}
                            phone={customer.phone}
                            onClickView={() => handleOpenViewCustomer(customer)}
                            onClickEdit={() => handleEditClick(customer.id)}
                        />
                    )) : <h5 style={{ marginTop: '20px' }}>There are no customers. Click Add New to create one.</h5>}
                </div>
            </div>
            <Dialog open={openViewCustomer} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseViewCustomer(event, reason) } }}>
                <DialogTitle sx={{ width: '400px', borderBottom: '1px solid #006d77', marginBottom: '10px' }}>
                    Customer Details
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Last Name:</FormLabel> {customer.lastName}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>First Name:</FormLabel> {customer.firstName}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Phone:</FormLabel> {customer.phone}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Address:</FormLabel> {customer.address}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Email:</FormLabel> {customer.email != null ? customer.email : 'N/A'}
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{
                            marginTop: '10px',
                            color: '#006d77',
                            border: '1px solid #006d77',
                            '&:hover': {
                                border: '1px solid #006d77',
                            },
                        }}
                        onClick={() => handleViewBookings(customer.id)}>
                        View Bookings
                    </Button>
                </DialogContent>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseViewCustomer} />
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Customers;