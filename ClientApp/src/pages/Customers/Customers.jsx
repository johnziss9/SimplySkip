import React, { useState, useEffect } from "react";
import './Customers.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomerCard from "../../components/CustomerCard/CustomerCard";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, Typography, useMediaQuery } from "@mui/material";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import handleHttpRequest from "../../api/api";

function Customers() {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [openViewCustomer, setOpenViewCustomer] = useState(false);
    const [customer, setCustomer] = useState({});
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
    const [openActiveBookingsDialog, setOpenActiveBookingsDialog] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    const searchbarWidth = useMediaQuery('(max-width: 550px)');

    const baseUrl = process.env.REACT_APP_URL;

    useEffect(() => {
        handleFetchCustomers();
        // eslint-disable-next-line
    }, []);

    const handleFetchCustomers = async () => {
        const url = '/customer/';
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            setCustomers(data);
        } else {
            setSnackbarMessage('Failed to load customers.');
            setShowSnackbar(true);
        }
    };

    const handleDeleteClick = async (id) => {
        const url = `/customer/${id}`;
        const method = 'PUT';
        const body = {
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone,
            email: customer.email,
            address: customer.address.replace(/\n/g, ', '),
            deleted: true,
            createdOn: customer.createdOn,
            lastUpdated: new Date(new Date()),
            deletedOn: new Date(new Date())
        };

        const { success } = await handleHttpRequest(url, method, body);

        if (success) {            
            handleCloseDeleteDialog();
            handleShowDeleteSuccess();
        } else {
            setSnackbarMessage('Failed to delete customer.');
            setShowSnackbar(true);
        }
    };

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

    const handleCheckDeleteCustomer = async (customer) => {
        const url = `/booking/customer/${customer.id}`;
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            const activeBookings = data.filter(booking => (!booking.returned || !booking.paid) && !booking.cancelled);

            if (activeBookings.length > 0)
                handleShowActiveBookingsDialog();
            else
                handleShowDeleteDialog(customer);
        } else {
            setSnackbarMessage('Failed to load bookings.');
            setShowSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage('');
    };

    const handleShowDeleteDialog = (customer) => {
        setCustomer(customer);
        setOpenDeleteDialog(true);
    }
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleShowDeleteSuccess = () => setOpenDeleteSuccess(true);
    const handleCloseDeleteSuccess = () => {
        setOpenDeleteSuccess(false);
        handleFetchCustomers();
    }

    const handleShowActiveBookingsDialog = () => setOpenActiveBookingsDialog(true);
    const handleCloseActiveBookingsDialog = () => setOpenActiveBookingsDialog(false);

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
                    width={searchbarWidth ? '300px' : '500px'}
                    margin={'normal'}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    display={customers.length > 0 ? '' :  'none'}
                />
                <div className="customers-section">
                    {Array.isArray(filteredCustomers) && filteredCustomers.length > 0 ? filteredCustomers.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn)).map((customer) => (
                        <CustomerCard
                            key={customer.id}
                            statusBorder={'10px solid #83c5be'}
                            lastName={customer.lastName}
                            firstName={customer.firstName}
                            phone={customer.phone}
                            onClickView={() => handleOpenViewCustomer(customer)}
                            onClickEdit={() => handleEditClick(customer.id)}
                            onClickDelete={() => handleCheckDeleteCustomer(customer)}
                        />
                    )) : <h5 style={{ marginTop: '20px', textAlign: 'center', padding: '0 10px' }}>There are no customers. Click Add New to create one.</h5>}
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
                        <FormLabel>Email:</FormLabel> {customer.email ? customer.email : 'N/A'}
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
            <Dialog open={openDeleteDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseDeleteDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    Delete Customer?
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"No"} width={"100px"} height={"45px"} onClick={handleCloseDeleteDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Yes"} width={"100px"} height={"45px"} onClick={() => handleDeleteClick(customer.id)} />
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseDeleteSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    Customer Deleted.
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseDeleteSuccess} />
                </DialogActions>
            </Dialog>
            <Dialog open={openActiveBookingsDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseActiveBookingsDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    Deletion failed. Active bookings exist.
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseActiveBookingsDialog} />
                </DialogActions>
            </Dialog>
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity="error" />
        </>
    );
}

export default Customers;