import React, { useState, useEffect } from "react";
import './CustomerBookings.css';
import { useNavigate, useParams } from "react-router-dom";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomerBookingCard from "../../components/CustomerBookingCard/CustomerBookingCard";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from "@mui/material";
import CustomButton from "../../components/CustomButton/CustomButton";

function CustomerBookings() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [bookings, setBookings] = useState([]);
    const [booking, setBooking] = useState({});
    const [customer, setCustomer] = useState({});
    const [selectedValue, setSelectedValue] = useState('All'); // Handling the Radio Buttons
    const [openViewBooking, setOpenViewBooking] = useState(false);

    useEffect(() => {
        handleFetchCustomerBookings();
        handleFetchCustomer();
        // eslint-disable-next-line
    }, []);

    const handleFetchCustomerBookings = async () => {
        const response = await fetch(`https://localhost:7197/booking/customer/${id}`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const bookings = await response.json();

            setBookings(bookings);
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleFetchCustomer = async () => {
        const response = await fetch(`https://localhost:7197/customer/${id}`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const customer = await response.json();

            setCustomer(customer);
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleOpenViewBooking = (booking) => {
        setBooking(booking);
        setOpenViewBooking(true);
    }
    const handleCloseViewBooking = () => setOpenViewBooking(false);

    const handleEditClick = (bookingId) => {
        navigate(`/Booking/${bookingId}/customer-bookings`);
    }

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

    function handleCalculateDays(hireDate) {
        const dateOfHire = new Date(hireDate);
        const today = new Date();
        const timeDifference = today - dateOfHire;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

        if (days > 0)
            return 'Rented for ' + Math.abs(days) + ' Days';
        else if (days == 0)
            return 'Rented Today'
        else
            return 'Starting in ' + Math.abs(days);
    }

    return (
        <>
            <CustomNavbar currentPage={`Bookings for ${customer.firstName} ${customer.lastName}`} addNewClick={'/Booking'} customerId={customer.id} />
            <div className='customer-bookings-container'>
                <RadioGroup sx={{ marginTop: '20px' }} value={selectedValue} onChange={handleRadioChange} row>
                    <FormControlLabel value="All" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="All" sx={{ display: 'inline' }} />
                    <FormControlLabel value="Active" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Active" sx={{ display: getActiveBookings().length > 0 ? 'inline' : 'none' }} />
                    <FormControlLabel value="Unpaid" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Unpaid" sx={{ display: getUnpaidBookings().length > 0 ? 'inline' : 'none' }} />
                    <FormControlLabel value="Past" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Past" sx={{ display: getPastBookings().length > 0 ? 'inline' : 'none' }} />
                    <FormControlLabel value="Cancelled" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Cancelled" sx={{ display: getCancelledBookings().length > 0 ? 'inline' : 'none' }} />
                </RadioGroup>
                <div className="customer-bookings-section">
                    {Array.isArray(filteredBookings) ? filteredBookings.map((booking) => (
                        <CustomerBookingCard
                            key={booking.id}
                            statusBorder={booking.cancelled && !booking.returned && !booking.paid
                                ? "10px solid grey"
                                : !booking.cancelled && !booking.returned && !booking.paid
                                    ? "10px solid green"
                                    : !booking.cancelled && booking.returned && !booking.paid
                                        ? "10px solid red"
                                        : !booking.cancelled && booking.returned && booking.paid
                                            ? "10px solid blue"
                                            : "10px solid black"}                            hireDate={new Date(booking.hireDate).toLocaleDateString()}
                            returnDateOrDays={booking.returned ? new Date(booking.returnDate).toLocaleDateString() : booking.cancelled ? 'Cancelled' : handleCalculateDays(booking.hireDate)}
                            address={booking.address}
                            onClickView={() => handleOpenViewBooking(booking)}
                            onClickEdit={() => handleEditClick(booking.id)}
                            disabledEditButton={booking.returned && booking.paid ? true : false}
                            disabledCancelButton={booking.returned && booking.paid ? true : false}
                        />
                    )) : null}
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
                        <FormLabel>Email:</FormLabel> {customer.email != null ? customer.email : 'N/A'}
                    </Typography>
                    <hr />
                    <Typography variant="h6" sx={{ margin: '5px' }} >
                        Booking
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Skip:</FormLabel> {booking.skipId}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Address:</FormLabel> {booking.address}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Hire Date:</FormLabel> {new Date(booking.hireDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>{!booking.returned ? 'Hired For:' : 'Return Date:'}</FormLabel> {!booking.returned ? handleCalculateDays(booking.hireDate) : new Date(booking.returnDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Notes:</FormLabel> {booking.notes != null ? booking.notes : 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Returned:</FormLabel> {booking.returned ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Paid:</FormLabel> {booking.paid ? 'Yes' : 'No'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseViewBooking} />
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CustomerBookings;