import React, { useState, useEffect } from "react";
import './Bookings.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormLabel, Radio, RadioGroup, Typography, useMediaQuery } from "@mui/material";
import BookingCard from "../../components/BookingCard/BookingCard";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import handleHttpRequest from "../../api/api";

function Bookings() {

    const navigate = useNavigate();

    const [selectedValue, setSelectedValue] = useState('All'); // Handling the Radio Buttons
    const [bookings, setBookings] = useState([]);
    const [customerDetails, setCustomerDetails] = useState({});
    const [booking, setBooking] = useState({});
    const [customer, setCustomer] = useState({});
    const [openViewBooking, setOpenViewBooking] = useState(false);
    const [skip, setSkip] = useState({}); // Used for changing skip status
    const [openCancelSuccess, setOpenCancelSuccess] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);

    const radioButtonsWidth = useMediaQuery('(max-width: 550px)');

    const baseUrl = process.env.REACT_APP_URL;

    useEffect(() => {
        handleFetchBookings();
        // eslint-disable-next-line
    }, []);

    const handleFetchBookings = async () => {
        const response = await fetch(`${baseUrl}/booking/`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const bookings = await response.json();

            setBookings(bookings);
            handleGetCustomer(bookings);
        } else {
            setSnackbarMessage('Failed to load bookings.');
            setShowSnackbar(true);
        }
    }

    const handleGetCustomer = async (activeBookings) => {
        const promises = activeBookings.map(async (booking) => {
            const url = `/customer/${booking.customerId}`;
            const method = 'GET';
    
            const { success, data } = await handleHttpRequest(url, method);
    
            if (success) {
                return { [booking.customerId]: data };
            } else {
                setSnackbarMessage('Failed to load customer for current booking.'); 
                setShowSnackbar(true);
            }
        });
    
        try {
            const results = await Promise.all(promises);
    
            const details = {};
            results.forEach((result) => {
                if (result) {
                    const customerId = Object.keys(result)[0];
                    details[customerId] = result[customerId];
                }
            });
    
            setCustomerDetails(details);
        } catch (error) {
            setSnackbarMessage('An error occurred. Please try again later.');
            setShowSnackbar(true);
        }
    };
    
    const handleFetchCustomer = async (id) => {
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

    const handleFetchSkip = async (id) => {
        const response = await fetch(`${baseUrl}/skip/${id}`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const skipData = await response.json();

            setSkip(skipData);
        } else {
            setSnackbarMessage('Failed to load customer.'); 
            setShowSnackbar(true);
        }
    }

    const handleOpenViewBooking = (booking) => {
        setBooking(booking);
        handleFetchCustomer(booking.customerId)
        handleFetchSkip(booking.skipId);
        setOpenViewBooking(true);
    }
    const handleCloseViewBooking = () => setOpenViewBooking(false);

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
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

    const handleEditClick = (id) => {
        navigate(`/Booking/${id}/all-bookings`);
    }

    const handleCancelClick = async () => {
        const bookingResponse = await fetch(`${baseUrl}/booking/${booking.id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
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
            })
        });

        if (bookingResponse.ok) {
            const getSkipResponse = await fetch(`${baseUrl}/skip/${booking.skipId}`, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });

            if (getSkipResponse.ok) {
                const skip = await getSkipResponse.json();

                1(skip);

                const editSkipResponse = await fetch(`${baseUrl}/skip/${skip.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        name: skip.name,
                        size: skip.size,
                        notes: skip.notes,
                        rented: false,
                        deleted: skip.deleted,
                        createdOn: skip.createdOn,
                        lastUpdated: new Date(new Date()),
                        deleteOn: skip.deleteOn
                    })
                });

                if (editSkipResponse.ok) {
                    setSnackbarMessage(`Booking Cancelled. Skip ${skip.name} is now available.`); 
                    setSnackbarSuccess(true);
                    setShowSnackbar(true);
                } else {
                    setSnackbarMessage('Failed to update skip availability.'); 
                    setShowSnackbar(true);
                }
            } else {
                setSnackbarMessage('Failed to find skip associated to this booking.'); 
                setShowSnackbar(true);
            }

            handleShowCancelSuccess();
        } else {
            setSnackbarMessage('Failed to update booking to cancelled.'); 
            setShowSnackbar(true);
        }
    }

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage('');
        setSnackbarSuccess(false);
    };

    const handleShowCancelDialog = (booking) => {
        setBooking(booking)
        setOpenCancelDialog(true);
    }
    const handleCloseCancelDialog = () => setOpenCancelDialog(false);

    const handleShowCancelSuccess = () => {
        handleCloseCancelDialog();
        setOpenCancelSuccess(true);
        handleFetchBookings();
    }
    const handleCloseCancelSuccess = () => setOpenCancelSuccess(false);

    function handleCalculateDays(hireDate) {
        const dateOfHire = new Date(hireDate);
        const today = new Date();
        const timeDifference = today - dateOfHire;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

        if (days > 0)
            return 'Rented for ' + Math.abs(days) + ' Days';
        else if (days === 0)
            return 'Rented Today'
        else
            return 'Starting in ' + Math.abs(days);
    }

    return (
        <>
            <CustomNavbar currentPage={'Bookings'} addNewClick={'/Booking'} addNewSource="all-bookings" />
            <div className='bookings-container'>
                <RadioGroup sx={{ marginTop: '20px', display: filteredBookings.length > 0 ? 'flex' : 'none', width: radioButtonsWidth ? '300px' : '455px', justifyContent: 'center' }} value={selectedValue} onChange={handleRadioChange} row>
                    <FormControlLabel value="All" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="All" sx={{ display: 'inline' }} />
                    <FormControlLabel value="Active" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Active" sx={{ display: getActiveBookings().length > 0 ? 'inline' : 'none' }} />
                    <FormControlLabel value="Unpaid" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Unpaid" sx={{ display: getUnpaidBookings().length > 0 ? 'inline' : 'none' }} />
                    <FormControlLabel value="Past" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Past" sx={{ display: getPastBookings().length > 0 ? 'inline' : 'none' }} />
                    <FormControlLabel value="Cancelled" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Cancelled" sx={{ display: getCancelledBookings().length > 0 ? 'inline' : 'none' }} />
                </RadioGroup>
                <div className="bookings-section">
                    {Array.isArray(filteredBookings) && filteredBookings.length > 0 ? filteredBookings.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn)).map((booking) => (
                        <BookingCard
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
                            lastName={customerDetails[booking.customerId]?.lastName}
                            firstName={customerDetails[booking.customerId]?.firstName}
                            hireDate={new Date(booking.hireDate).toLocaleDateString()}
                            returnDateOrDays={booking.returned ? new Date(booking.returnDate).toLocaleDateString() : booking.cancelled ? 'Cancelled' : handleCalculateDays(booking.hireDate)}
                            address={booking.address}
                            onClickView={() => handleOpenViewBooking(booking)}
                            onClickEdit={() => handleEditClick(booking.id)}
                            onClickCancel={() => handleShowCancelDialog(booking)}
                            disabledEditButton={(booking.returned && booking.paid) || booking.cancelled}
                            disabledCancelButton={booking.returned || booking.paid || booking.cancelled || new Date(booking.hireDate) <= new Date()}
                        />
                    )) : <h5 style={{ marginTop: '20px', textAlign: 'center', padding: '0 10px' }}>There are no bookings. Click Add New to create one.</h5>}
                </div>
            </div>
            <Dialog open={openViewBooking} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseViewBooking(event, reason) } }}>
                <DialogTitle sx={{ width: '400px', borderBottom: '1px solid #006d77', marginBottom: '10px' }}>
                    Booking Details
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h6" sx={{ margin: '5px' }} >
                        Customer
                    </Typography>
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
                    <hr />
                    <Typography variant="h6" sx={{ margin: '5px' }} >
                        Booking
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Skip:</FormLabel> {skip.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Address:</FormLabel> {booking.address}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Hire Date:</FormLabel> {new Date(booking.hireDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>{booking.cancelled  || booking.returned ? 'Return Date:' : 'Hired For:'}</FormLabel> {booking.cancelled ? 'Cancelled' : !booking.returned ? handleCalculateDays(booking.hireDate) : new Date(booking.returnDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Notes:</FormLabel> {booking.notes ? booking.notes : 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Returned:</FormLabel> {booking.returned ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Paid:</FormLabel> {booking.paid ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Cancelled:</FormLabel> {booking.cancelled ? 'Yes' : 'No'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseViewBooking} />
                </DialogActions>
            </Dialog>
            <Dialog open={openCancelDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseCancelDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    Cancel Booking?
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"No"} width={"100px"} height={"45px"} onClick={handleCloseCancelDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Yes"} width={"100px"} height={"45px"} onClick={handleCancelClick} />
                </DialogActions>
            </Dialog>
            <Dialog open={openCancelSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseCancelSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    Cancel Successful
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseCancelSuccess} />
                </DialogActions>
            </Dialog>
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity={snackbarSuccess ? 'success' : 'error'} />
        </>
    );
}

export default Bookings;