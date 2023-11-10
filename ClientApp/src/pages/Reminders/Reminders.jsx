import React, { useState, useEffect } from 'react';
import './Reminders.css';
import RemindersCard from '../../components/ReminderCard/ReminderCard';
import { Dialog, DialogActions, DialogTitle, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import CustomNavbar from '../../components/CustomNavbar/CustomNavbar';

function Reminders() {
    const [activeBookings, setActiveBookings] = useState([]);
    const [customerDetails, setCustomerDetails] = useState({});
    const [openReturn, setOpenReturn] = React.useState(false); // Return Confirmation Catalog
    const [openPaid, setOpenPaid] = React.useState(false); // Paid Confirmation Catalog
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [openReturnSuccess, setOpenReturnSuccess] = React.useState(false);
    const [openPaidSuccess, setOpenPaidSuccess] = React.useState(false);
    const [selectedValue, setSelectedValue] = useState('All'); // Handling the Radio Buttons

    useEffect(() => {
        handleFetchedActiveBookings();
        // eslint-disable-next-line
    }, []);

    const handleFetchedActiveBookings = async () => {
        const response = await fetch("https://localhost:7197/booking/active", {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const data = await response.json();

            setActiveBookings(data);
            handleGetCustomer(data);
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleGetCustomer = async (activeBookings) => {
        const details = {};

        for (const booking of activeBookings) {

            const response = await fetch(`https://localhost:7197/customer/${booking.customerId}`, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });
            if (response.ok) {
                const customer = await response.json();

                details[booking.customerId] = customer;
            } else {
                // TODO Handle error if cards don't load
            }
        }

        setCustomerDetails(details);
    }

    const handleReturn = async (bookingId) => {
        const response = await fetch(`https://localhost:7197/booking/${bookingId}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                returned: true
            })
        });

        if (response.ok) {
            handleCloseReturn();
            handleFetchedActiveBookings();
            handleShowReturnSuccess();
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handlePaid = async (bookingId) => {
        const response = await fetch(`https://localhost:7197/booking/${bookingId}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                returned: true,
                paid: true
            })
        });

        if (response.ok) {
            handleClosePaid();
            handleFetchedActiveBookings();
            handleShowPaidSuccess();
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleOpenReturn = (bookingId) => {
        setSelectedBookingId(bookingId);
        setOpenReturn(true);
    }
    const handleCloseReturn = () => setOpenReturn(false);

    const handleOpenPaid = (bookingId) => {
        setSelectedBookingId(bookingId);
        setOpenPaid(true);
    }
    const handleClosePaid = () => setOpenPaid(false);

    const handleShowReturnSuccess = () => setOpenReturnSuccess(true);
    const handleHideReturnSuccess = () => setOpenReturnSuccess(false);

    const handleShowPaidSuccess = () => setOpenPaidSuccess(true);
    const handleHidePaidSuccess = () => setOpenPaidSuccess(false);

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

    // Filter active bookings based on booking.returned
    const getActiveBookings = () => {
        return activeBookings.filter((booking) => !booking.returned);
    };

    // Filter unpaid bookings based on booking.returned and booking.paid
    const getUnpaidBookings = () => {
        return activeBookings.filter((booking) => booking.returned && !booking.paid);
    };

    const filteredBookings = selectedValue === 'Active' ? getActiveBookings() : selectedValue === 'Unpaid' ? getUnpaidBookings() : activeBookings;


    function handleCalculateDays(hireDate) {
        const dateOfHire = new Date(hireDate);
        const today = new Date();
        const timeDifference = today - dateOfHire;

        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    }

    return (
        <>
            <CustomNavbar currentPage={'Reminders'} />
            <div className='reminders-container'>
                <RadioGroup sx={{ marginTop: '20px' }} value={selectedValue} onChange={handleRadioChange} row>
                    <FormControlLabel value="All" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="All" />
                    <FormControlLabel value="Active" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Active" />
                    <FormControlLabel value="Unpaid" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Unpaid" />
                </RadioGroup>
                <div className='reminders-section'>
                    {Array.isArray(filteredBookings) ? filteredBookings.map((booking) => (
                        <RemindersCard
                            key={booking.id}
                            statusBorder={!booking.returned ? "10px solid green" : "10px solid red"}
                            lastName={customerDetails[booking.customerId]?.lastName}
                            firstName={customerDetails[booking.customerId]?.firstName}
                            hireDate={booking.hireDate}
                            returnDateOrDays={!booking.returned ? handleCalculateDays(booking.hireDate) + ' Days' : booking.returnDate}
                            disableReturnedSwitch={booking.returned === true ? true : false}
                            disablePaidSwitch={!booking.returned ? true : false}
                            booking={booking}
                            onReturnedSwitchChange={() => handleOpenReturn(booking.id)}
                            onPaidSwitchChange={() => handleOpenPaid(booking.id)}
                        />
                    )) : null}
                </div>
            </div>
            <Dialog open={openReturn} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseReturn(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    Skip Returned?
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#83c5be"} buttonName={"No"} width={"100px"} height={"45px"} marginTop={"20px"} onClick={handleCloseReturn} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Yes"} width={"100px"} height={"45px"} marginTop={"20px"} onClick={() => handleReturn(selectedBookingId)} />
                </DialogActions>
            </Dialog>
            <Dialog open={openPaid} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleClosePaid(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    Skip Paid?
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#83c5be"} buttonName={"No"} width={"100px"} height={"45px"} marginTop={"20px"} onClick={handleClosePaid} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Yes"} width={"100px"} height={"45px"} marginTop={"20px"} onClick={() => handlePaid(selectedBookingId)} />
                </DialogActions>
            </Dialog>
            <CustomSnackbar open={openReturnSuccess} onClose={handleHideReturnSuccess} severity={"success"} onClick={handleHideReturnSuccess} value={"Skip has been marked as returned."} />
            <CustomSnackbar open={openPaidSuccess} onClose={handleHidePaidSuccess} severity={"success"} onClick={handleHidePaidSuccess} value={"Skip has been marked as paid."} />
        </>
    )
}

export default Reminders;