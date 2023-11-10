import React from "react";
import './Customers.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomTextField from "../../components/CustomTextField/CustomTextField";

function Customers() {
    return (
        <>
            <CustomNavbar currentPage={'Customers'} />
            <div className='customers-container'>
                <CustomTextField label={'Search...'} variant={'standard'} type={'search'} width={'500px'} margin={'normal'} />
            </div>
        </>
    );
}

export default Customers;