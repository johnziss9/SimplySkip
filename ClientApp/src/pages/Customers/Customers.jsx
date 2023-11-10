import React from "react";
import './Customers.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomerCard from "../../components/CustomerCard/CustomerCard";

function Customers() {
    return (
        <>
            <CustomNavbar currentPage={'Customers'} />
            <div className='customers-container'>
                <CustomTextField label={'Search...'} variant={'standard'} type={'search'} width={'500px'} margin={'normal'} />
                <div className="customers-section">
                    <CustomerCard lastName={'Theodosiou'} firstName={'Evripidis'} phone={'82734628'} statusBorder={'10px solid #83c5be'} />
                    <CustomerCard lastName={'Theodosiou'} firstName={'Evripidis'} phone={'82734628'} statusBorder={'10px solid #83c5be'} />
                    <CustomerCard lastName={'Theodosiou'} firstName={'Evripidis'} phone={'82734628'} statusBorder={'10px solid #83c5be'} />
                    <CustomerCard lastName={'Theodosiou'} firstName={'Evripidis'} phone={'82734628'} statusBorder={'10px solid #83c5be'} />
                </div>
            </div>
        </>
    );
}

export default Customers;