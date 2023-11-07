import React, { useState, useContext, useEffect } from 'react';
import './Reminders.css';
import RemindersCard from '../../components/RemindersCard/RemindersCard';

function Reminders() {
    const [activeBookings, setActiveBookings] = useState([]);
    const [customerDetails, setCustomerDetails] = useState({});

    // TODO Add condition to show the number of days if the skip hasn't been returned of the return date

    useEffect(() => {
        handleFetchedActiveBookings();
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

            console.log(data);
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

    function handleCalculateDays(hireDate) {
        const dateOfHire = new Date(hireDate);
        const today = new Date();
        const timeDifference = today - dateOfHire;
        
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    }

    return (
        <>
            <div className='reminders-container'>
                <div className='reminders-section'>
                    <div className='reminders-cards'>
                        {Array.isArray(activeBookings) ? activeBookings.map((booking) => (
                            <RemindersCard
                                key={booking.id}
                                statusBorder={!booking.returned ? "6px solid green" : "6px solid red"}
                                lastName={customerDetails[booking.customerId]?.lastName}
                                firstName={customerDetails[booking.customerId]?.firstName}
                                hireDate={booking.hireDate}
                                returnDateOrDays={!booking.returned ? handleCalculateDays(booking.hireDate) + ' Days' : booking.returnDate}
                            />
                        )) : null}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Reminders;