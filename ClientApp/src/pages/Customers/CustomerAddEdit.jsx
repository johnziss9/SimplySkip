import React, { useEffect, useState } from "react";
import './CustomerAddEdit.css';
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomButton from "../../components/CustomButton/CustomButton";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";

function CustomerAddEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');

    const [isValidEmail, setIsValidEmail] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [isEdit, setIsEdit] = useState(false); // TODO Check if this is used. Currently using it but I could use id from useParams?
    const [customer, setCustomer] = useState({}); // TODO Check if this is used

    useEffect(() => {
        if (id) {
            handleFetchCustomer();

            setIsEdit(true);
        }
    }, [id]);

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
        if (isEdit) {
            const response = await fetch(`https://localhost:7197/customer/${id}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    email: email,
                    address: address
                })
            });

            if (response.ok) {
                handleShowSuccess();
            } else {
                // TODO Handle error
            }
        } else {
            const response = await fetch('https://localhost:7197/customer', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    email: email,
                    address: address,
                    deleted: false
                })
            });

            if (response.ok) {
                handleShowSuccess();
            } else {
                // TODO Handle error
            }
        }
    }

    const handleOkAndCancel = () => {
        navigate('/Customers');
    };

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
            setFirstName(customer.firstName);
            setLastName(customer.lastName);
            setPhone(customer.phone);
            setAddress(customer.address);
            setEmail(customer.email);
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleShowSuccess = () => setOpenSuccess(true);
    const handleCloseSuccess = () => setOpenSuccess(false);

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
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"Cancel"} width={"200px"} height={"50px"} margin={'20px 10px 0 0'} onClick={handleOkAndCancel} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Submit"} width={"200px"} height={"50px"} margin={'20px 0 0 10px'} onClick={handleSubmitCustomer} />
                    </div>
                </div>
            </div>
            <Dialog open={openSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    {isEdit ? "Customer Edited." : "Customer Added."}
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleOkAndCancel} />
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CustomerAddEdit;