import React, { useState, useEffect } from "react";
import './Customers.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomerCard from "../../components/CustomerCard/CustomerCard";

function Customers() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        handleFetchedCustomers();
        // eslint-disable-next-line
    }, []);

    const handleFetchedCustomers = async () => {
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

    return (
        <>
            <CustomNavbar currentPage={'Customers'} />
            <div className='customers-container'>
                <CustomTextField label={'Search...'} variant={'standard'} type={'search'} width={'500px'} margin={'normal'} />
                <div className="customers-section">
                    {Array.isArray(customers) ? customers.map((customer) => (
                        <CustomerCard
                            key={customer.id}
                            statusBorder={'10px solid #83c5be'}
                            lastName={customer.lastName}
                            firstName={customer.firstName}
                            phone={customer.phone}
                        />
                    )) : null}
                </div>
            </div>
        </>
    );
}

export default Customers;