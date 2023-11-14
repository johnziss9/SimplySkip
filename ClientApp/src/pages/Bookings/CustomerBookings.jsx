import React, { useState, useEffect } from "react";
import './CustomerBookings.css';
import { useParams } from "react-router-dom";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomerBookingCard from "../../components/CustomerBookingCard/CustomerBookingCard";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

function CustomerBookings() {

    const { id } = useParams();

    const [bookings, setBookings] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [selectedValue, setSelectedValue] = useState('All'); // Handling the Radio Buttons

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
            <CustomNavbar currentPage={`Bookings for ${customer.firstName} ${customer.lastName}`} />
            <div className='customer-bookings-container'>
                <RadioGroup sx={{ marginTop: '20px' }} value={selectedValue} onChange={handleRadioChange} row>
                    <FormControlLabel value="All" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="All" />
                    <FormControlLabel value="Active" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Active" />
                    <FormControlLabel value="Unpaid" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Unpaid" />
                    <FormControlLabel value="Past" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Past" />
                </RadioGroup>
                <div className="customer-bookings-section">
                    {Array.isArray(filteredBookings) ? filteredBookings.map((booking) => (
                        <CustomerBookingCard
                            key={booking.id}
                            statusBorder={!booking.returned ? "10px solid green" : !booking.paid ? "10px solid red" : "10px solid grey"}
                            hireDate={booking.hireDate}
                            returnDateOrDays={!booking.returned ? handleCalculateDays(booking.hireDate) + ' Days' : booking.returnDate}
                            address={booking.address}
                        />
                    )) : null}
                </div>
            </div>
        </>
    );
}

export default CustomerBookings;