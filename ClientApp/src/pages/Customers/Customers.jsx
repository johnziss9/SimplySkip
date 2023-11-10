import React, { useState, useEffect } from "react";
import './Customers.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomerCard from "../../components/CustomerCard/CustomerCard";

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredCustomers = customers.filter((customer) =>
        customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <CustomNavbar currentPage={'Customers'} />
            <div className='customers-container'>
                <CustomTextField 
                    label={'Search...'} 
                    variant={'standard'} 
                    type={'search'} 
                    width={'500px'} 
                    margin={'normal'}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <div className="customers-section">
                    {Array.isArray(filteredCustomers) ? filteredCustomers.map((customer) => (
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