import React, { useState, useEffect } from "react";
import './Bookings.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import BookingCard from "../../components/BookingCard/BookingCard";

function Bookings() {

    const [selectedValue, setSelectedValue] = useState('All'); // Handling the Radio Buttons
    const [bookings, setBookings] = useState([]);
    const [customerDetails, setCustomerDetails] = useState({});

    useEffect(() => {
        handleFetchBookings();
        // eslint-disable-next-line
    }, []);

    const handleFetchBookings = async () => {
        const response = await fetch('https://localhost:7197/booking/', {
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

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const getActiveBookings = () => {
        return bookings.filter((booking) => !booking.returned);
    };

    const getUnpaidBookings = () => {
        return bookings.filter((booking) => booking.returned && !booking.paid);
    };

    const getPastBookings = () => {
        return bookings.filter((booking) => booking.returned && booking.paid);
    };

    const filteredBookings = selectedValue === 'Active' ? getActiveBookings() : selectedValue === 'Unpaid'
        ? getUnpaidBookings() : selectedValue === 'Past' ? getPastBookings() : bookings;

    function handleCalculateDays(hireDate) {
        const dateOfHire = new Date(hireDate);
        const today = new Date();
        const timeDifference = today - dateOfHire;

        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    }

    return (
        <>
            <CustomNavbar currentPage={'Bookings'} addNewClick={'/Booking'} />
            <div className='bookings-container'>
                <RadioGroup sx={{ marginTop: '20px' }} value={selectedValue} onChange={handleRadioChange} row>
                    <FormControlLabel value="All" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="All" />
                    <FormControlLabel value="Active" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Active" />
                    <FormControlLabel value="Unpaid" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Unpaid" />
                    <FormControlLabel value="Past" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Past" />
                </RadioGroup>
                <div className="bookings-section">
                    {Array.isArray(filteredBookings) ? filteredBookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            statusBorder={!booking.returned ? "10px solid green" : !booking.paid ? "10px solid red" : "10px solid grey"}
                            lastName={customerDetails[booking.customerId]?.lastName}
                            firstName={customerDetails[booking.customerId]?.firstName}
                            hireDate={booking.hireDate}
                            returnDateOrDays={!booking.returned ? handleCalculateDays(booking.hireDate) + ' Days' : booking.returnDate}
                            address={booking.address}
                        // onClickView={() => handleOpenViewBooking(booking)}
                        // onClickEdit={() => handleEditClick(booking.id)}
                        />
                    )) : null}
                </div>
            </div>
        </>
    );
}

export default Bookings;