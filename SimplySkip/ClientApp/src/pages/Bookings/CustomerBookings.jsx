import React, { useState, useEffect } from "react";
import './CustomerBookings.css';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomerBookingCard from "../../components/CustomerBookingCard/CustomerBookingCard";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormLabel, Radio, RadioGroup, Typography, useMediaQuery, IconButton } from "@mui/material";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import handleHttpRequest from "../../api/api";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CustomerBookings() {

    const navigate = useNavigate();
    const location = useLocation();
    const filterAddress = location.state?.filterAddress;

    const { id } = useParams();

    const [bookings, setBookings] = useState([]);
    const [booking, setBooking] = useState({});
    const [customer, setCustomer] = useState({});
    const [selectedValue, setSelectedValue] = useState('All'); // Handling the Radio Buttons
    const [openViewBooking, setOpenViewBooking] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [openCancelSuccess, setOpenCancelSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);

    const radioButtonsWidth = useMediaQuery('(max-width: 550px)');

    useEffect(() => {
        handleFetchCustomerBookings();
        handleFetchCustomer();
        // eslint-disable-next-line
    }, []);

    const handleFetchCustomerBookings = async () => {
        const url = `/booking/customer/${id}`;
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            // Store all bookings in a variable first
            const allBookings = data;
            
            // Reset any previous filters (radio buttons)
            setSelectedValue('All');
                
            // Filter bookings by address
            const filteredData = allBookings.filter(booking => 
                booking.address === filterAddress
            );
            
            setBookings(filteredData);
        } else {
            setSnackbarMessage('Failed to load customer bookings.');
            setShowSnackbar(true);
        }
    };

    const handleFetchCustomer = async () => {
        const url = `/customer/${id}`;
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            setCustomer(data);
        } else {
            setSnackbarMessage('Failed to load customer.');
            setShowSnackbar(true);
        }
    };

    const handleCancelClick = async () => {
        const url = `/booking/${booking.id}`;
        const method = 'PUT';
        const body = {
            customerId: booking.customerId,
            skipId: booking.skipId,
            hireDate: booking.hireDate,
            returnDate: booking.returnDate,
            address: booking.address.replace(/\n/g, ', '),
            notes: booking.notes.replace(/\n/g, ', '),
            returned: booking.returned,
            paid: booking.paid,
            cancelled: true,
            createdOn: booking.createdOn,
            lastUpdated: new Date(new Date()),
            cancelledOn: new Date(new Date())
        };

        const { success } = await handleHttpRequest(url, method, body);

        if (success) {
            const url = `/skip/${booking.skipId}`;
            const method = 'GET';
    
            const { success, data } = await handleHttpRequest(url, method);
    
            if (success) {            
                handleAddAuditLogEntry(`Ακὐρωση κρἀτησης για τον πελἀτη ${customer.lastName}, ${customer.firstName}.`);
                const url = `/skip/${data.id}`;
                const method = 'PUT';
                const body = {
                    name: data.name,
                    size: data.size,
                    notes: data.notes,
                    rented: false,
                    deleted: data.deleted,
                    createdOn: data.createdOn,
                    lastUpdated: new Date(new Date()),
                    deleteOn: data.deleteOn
                };

                const { success } = await handleHttpRequest(url, method, body);

                if (success) {            
                    setSnackbarMessage(`Η κράτηση ακυρώθηκε. Το Skip ${data.name} είναι τώρα διαθέσιμο.`); 
                    setSnackbarSuccess(true); 
                    setShowSnackbar(true);
                } else {
                    setSnackbarMessage('Failed to update skip availability.'); 
                    setShowSnackbar(true);
                }
            } else {
                setSnackbarMessage('Failed to find skip associated with this booking.'); 
                setShowSnackbar(true);
            }

            handleShowCancelSuccess();
        } else {
            setSnackbarMessage('Failed to set booking to cancelled.'); 
            setShowSnackbar(true);
        }
    }

    const handleAddAuditLogEntry = async (action) => {
        const url = '/auditLog/';
        const method = 'POST';
        const body = {
            userId: sessionStorage.getItem('userId'),
            username: sessionStorage.getItem('username'),
            action: action
        };

        const { success } = await handleHttpRequest(url, method, body);

        if (!success) {
            setSnackbarMessage('Failed to add audit log.');
            setShowSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage('');
        setSnackbarSuccess(false)
    };

    const handleOpenViewBooking = (booking) => {
        setBooking(booking);
        setOpenViewBooking(true);
    }
    const handleCloseViewBooking = () => setOpenViewBooking(false);

    const handleEditClick = (bookingId) => {
        navigate(`/Booking/${bookingId}/customer-bookings`);
    }

    const handleShowCancelDialog = (booking) => {
        setBooking(booking)
        setOpenCancelDialog(true);
    }
    const handleCloseCancelDialog = () => setOpenCancelDialog(false);

    const handleShowCancelSuccess = () => {
        handleCloseCancelDialog();
        setOpenCancelSuccess(true);
        handleFetchCustomerBookings();
    }
    const handleCloseCancelSuccess = () => setOpenCancelSuccess(false);

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleBackToAddresses = () => {
        navigate(`/Addresses/${id}`);
    };

    const getActiveBookings = () => {
        return bookings.filter((booking) => !booking.returned && !booking.cancelled);
    };

    const getUnpaidBookings = () => {
        return bookings.filter((booking) => booking.returned && !booking.paid && !booking.cancelled);
    };

    const getPastBookings = () => {
        return bookings.filter((booking) => booking.returned && booking.paid && !booking.cancelled);
    };

    const getCancelledBookings = () => {
        return bookings.filter((booking) => booking.cancelled);
    };

    const filteredBookings = selectedValue === 'Active' ? getActiveBookings() : selectedValue === 'Unpaid'
        ? getUnpaidBookings() : selectedValue === 'Past' ? getPastBookings() : selectedValue === 'Cancelled' ? getCancelledBookings() : bookings;

    function handleCalculateDays(hireDate) {
        const dateOfHire = new Date(hireDate);
        const today = new Date();
        const timeDifference = today - dateOfHire;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

        if (days > 0) {
            if (days === 1)
                return 'Εκτὀς για ' + Math.abs(days) + ' μέρα';
            else
                return 'Εκτὀς για ' + Math.abs(days) + ' μέρες';
        }
        else if (days === 0)
            return 'Εκτὀς Σἠμερα'
        else {
            if (days === -1)
                return 'Ξεκινά σε ' + Math.abs(days) + ' μέρα';
            else
                return 'Ξεκινά σε ' + Math.abs(days) + ' μέρες';
        }
    }

    return (
        <>  
            <CustomNavbar 
                currentPage={`Κρατἠσεις για ${customer.firstName} ${customer.lastName}`}
                addNewClick={'/Booking'} 
                customerId={customer.id} 
                addNewSource="customer-bookings" 
            />
            <div className='customer-bookings-container'>
                <div className="customer-bookings-header">
                    <IconButton 
                        onClick={handleBackToAddresses}
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
                        {filterAddress}
                    </Typography>
                </div>

                <RadioGroup sx={{ marginTop: '20px', display: filteredBookings.length > 0 ? 'flex' : 'none', width: radioButtonsWidth ? '300px' : '455px', justifyContent: 'center' }} value={selectedValue} onChange={handleRadioChange} row>
                    <FormControlLabel value="All" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Όλες" sx={{ display: 'inline' }} />
                    <FormControlLabel value="Active" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Τρέχουσες" sx={{ display: getActiveBookings().length > 0 ? 'inline' : 'none' }} />
                    <FormControlLabel value="Unpaid" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Ανεξόφλητες" sx={{ display: getUnpaidBookings().length > 0 ? 'inline' : 'none' }} />
                    <FormControlLabel value="Past" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Ολοκληρωμένες" sx={{ display: getPastBookings().length > 0 ? 'inline' : 'none' }} />
                    <FormControlLabel value="Cancelled" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Ακυρωμένες" sx={{ display: getCancelledBookings().length > 0 ? 'inline' : 'none' }} />
                </RadioGroup>
                <div className="customer-bookings-section">
                    {Array.isArray(filteredBookings) && filteredBookings.length > 0 ? filteredBookings.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn)).map((booking) => (
                        <CustomerBookingCard
                            key={booking.id}
                            statusBorder={booking.cancelled // cancelled
                                ? "10px solid black"
                                : !booking.cancelled && !booking.returned && !booking.paid // active
                                    ? "10px solid green"
                                    : !booking.cancelled && booking.returned && !booking.paid // retuend & unpaid
                                        ? "10px solid red"
                                        : !booking.cancelled && booking.returned && booking.paid // past
                                            ? "10px solid grey"
                                            : "10px solid white"}                          
                            hireDate={new Date(booking.hireDate).toLocaleDateString()}
                            returnDateOrDays={booking.returned ? new Date(booking.returnDate).toLocaleDateString() : booking.cancelled ? 'Cancelled' : handleCalculateDays(booking.hireDate)}
                            address={booking.address}
                            onClickView={() => handleOpenViewBooking(booking)}
                            onClickEdit={() => handleEditClick(booking.id)}
                            onClickCancel={() => handleShowCancelDialog(booking)}
                            disabledEditButton={(booking.returned && booking.paid) || booking.cancelled}
                            disabledCancelButton={booking.returned || booking.paid || booking.cancelled || new Date(booking.hireDate) <= new Date()}
                        />
                    )) : <h5 style={{ marginTop: '20px' }}>Δεν υπάρχουν κρατήσεις. Κάντε κλικ στο Προσθήκη Νέου για να δημιουργήσετε μία.</h5>}
                </div>
            </div>
            <Dialog open={openViewBooking} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseViewBooking(event, reason) } }}>
                <DialogTitle sx={{ width: '100%', borderBottom: '1px solid #006d77', marginBottom: '10px' }}>
                    Πληροφορἰες Κρἀτησης
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h6" sx={{ margin: '5px' }} >
                        Πελἀτης
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Επὠνυμο:</FormLabel> {customer.lastName}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Ὀνομα:</FormLabel> {customer.firstName}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Τηλἐφωνο:</FormLabel> {customer.phone}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Διεὐθυνση:</FormLabel> {customer.address}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Email:</FormLabel> {customer.email ? customer.email : 'Μ/Δ'}
                    </Typography>
                    <hr />
                    <Typography variant="h6" sx={{ margin: '5px' }} >
                        Κρἀτηση
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Skip:</FormLabel> {booking.skipId}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Διεὐθυνση:</FormLabel> {booking.address}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Ημερομηνία Κρἀτησης:</FormLabel> {new Date(booking.hireDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Επιστροφή:</FormLabel> {booking.cancelled ? 'Cancelled' : !booking.returned ? handleCalculateDays(booking.hireDate) : new Date(booking.returnDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Σημειώσεις:</FormLabel> {booking.notes ? booking.notes : 'Μ/Δ'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Επιστράφηκε:</FormLabel> {booking.returned ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Πληρώθηκε:</FormLabel> {booking.paid ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Ακυρώθηκε:</FormLabel> {booking.cancelled ? 'Ναι' : 'Ὀχι'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseViewBooking} />
                </DialogActions>
            </Dialog>
            <Dialog open={openCancelDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseCancelDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    Ακὐρωση Κρἀτησης;
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"No"} width={"100px"} height={"45px"} onClick={handleCloseCancelDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Yes"} width={"100px"} height={"45px"} onClick={handleCancelClick} />
                </DialogActions>
            </Dialog>
            <Dialog open={openCancelSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseCancelSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    Κρἀτηση Ακυρώθηκε.
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseCancelSuccess} />
                </DialogActions>
            </Dialog>
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity={snackbarSuccess ? 'success' : 'error' } />
        </>
    );
}

export default CustomerBookings;