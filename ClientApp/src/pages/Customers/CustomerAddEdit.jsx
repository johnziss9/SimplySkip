import React, { useState } from "react";
import './CustomerAddEdit.css';
import { useNavigate } from "react-router-dom";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomButton from "../../components/CustomButton/CustomButton";

function CustomerAddEdit() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);

    const handlePhoneInput = (event) => {
        setPhone(event.target.value);
        const inputText = event.target.value;
        const numericValue = inputText.replace(/[^0-9]/g, '');
        setPhone(numericValue);
    };

    const handleEmailInput = (event) => {
        setEmail(event.target.value);
        const newEmail = event.target.value;
        setEmail(newEmail);

        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
        setIsValidEmail(isValid);
        // TODO On submit, check if isValidEmail is true
    };

    const handleSubmitCustomer = async () => {
        const response = await fetch('https://localhost:7197/customer', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                id: 9,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                address: address,
                deleted: false
            })
        });

        if (response.ok) {
            navigate('/Customers');
        } else {
            // TODO Handle error
        }
    }

    const handleCancel = () => {
        navigate('/Customers');
    };

    return (
        <>
            <CustomNavbar currentPage={'Customer Information'} />
            <div className='customer-add-edit-container'>
                <div className="customer-add-edit-form">
                    <CustomTextField label={'First Name'} variant={'outlined'} required={true} margin={'normal'} width={'440px'} onChange={e => setFirstName(e.target.value)} value={firstName} />
                    <CustomTextField label={'Last Name'} variant={'outlined'} required={true} margin={'normal'} width={'440px'} onChange={e => setLastName(e.target.value)} value={lastName} />
                    <CustomTextField label={'Phone Number'} variant={'outlined'} margin={'normal'} onChange={handlePhoneInput} value={phone} required={true} width={'440px'} />
                    <CustomTextField label={'Email'} variant={'outlined'} margin={'normal'} width={'440px'} onChange={handleEmailInput} value={email} />
                    <CustomTextField label={'Address'} variant={'outlined'} margin={'normal'} required={true} multiline={true} rows={4} maxRows={7} width={'440px'} onChange={e => setAddress(e.target.value)} value={address} />
                    <div className="customer-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"Cancel"} width={"200px"} height={"50px"} margin={'20px 10px 0 0'} onClick={handleCancel} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Submit"} width={"200px"} height={"50px"} margin={'20px 0 0 10px'} onClick={handleSubmitCustomer} />
                    </div>
                </div>

            </div>
        </>
    )
}

export default CustomerAddEdit;