import React, { useEffect, useState } from "react";
import './CustomerAddEdit.css';
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomButton from "../../components/CustomButton/CustomButton";
import { Alert, Dialog, DialogActions, DialogTitle, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function CustomerAddEdit() {
    const navigate = useNavigate();
    
    const { id } = useParams();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [createdOn, setCreatedOn] = useState(new Date());
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [deletedOn, setDeletedOn] = useState(new Date());

    const [isValidEmail, setIsValidEmail] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false); // TODO Check if this is used. Currently using it but I could use id from useParams?
    const [customer, setCustomer] = useState({}); // TODO Check if this is used
    const [addEditFailed, setAddEditFailed] = useState(false);
    const [error, setError] = useState('');

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [emailError, setEmailError] = useState(false);

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
        const newEmail = event.target.value;
        setEmail(newEmail);

        // Check if the email is not blank before validation
        if (newEmail.trim() !== "") {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
            setIsValidEmail(isValid);
        } else {
            // Reset the email validation if the email is blank
            setIsValidEmail(true);
        }
    };

    const handleSubmitCustomer = async () => {
        if (!isValidEmail && email !== null && email.trim() !== "") {
            setError("Please enter a valid email address");
            setEmailError(true);
            handleShowFailedAddEdit();
            return; // Stop further execution if email is not valid
        }
        
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
                    address: address.replace(/\n/g, ', '),
                    createdOn: createdOn,
                    lastUpdated: new Date(new Date().setHours(0, 0, 0, 0)),
                    // deletedOn: deleted ? new Date(new Date().setHours(0, 0, 0, 0)) : deletedOn
                })
            });

            if (response.ok) {
                handleCloseAddEditDialog()
                handleShowSuccess();
            } else {
                const data = await response.json();

                if (!firstName || !lastName || !address || !phone) {
                    setError('Please fill in required fields.')
                    setFirstNameError(true);
                    setLastNameError(true);
                    setAddressError(true);
                    setPhoneError(true);
                } else {
                    const { title } = data;

                    setError(title);
                }

                handleShowFailedAddEdit();
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
                    address: address.replace(/\n/g, ', '),
                    deleted: false,
                    createdOn: new Date(new Date().setHours(0, 0, 0, 0)),
                    lastUpdated: new Date(new Date().setHours(0, 0, 0, 0)),
                    deletedOn: new Date(new Date().setHours(0, 0, 0, 0))
                })
            });

            if (response.ok) {
                handleCloseAddEditDialog()
                handleShowSuccess();
            } else {
                const data = await response.json();

                if (!firstName || !lastName || !address || !phone) {
                    setError('Please fill in required fields.')
                    setFirstNameError(true);
                    setLastNameError(true);
                    setAddressError(true);
                    setPhoneError(true);
                } else {
                    const { title } = data;

                    setError(title);
                }

                handleShowFailedAddEdit();
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
            setAddress(customer.address.replace(/, /g, '\n'));
            setEmail(customer.email);
            setCreatedOn(new Date(new Date(customer.createdOn).setHours(0, 0, 0, 0)));
            setLastUpdated(new Date(new Date(customer.lastUpdated).setHours(0, 0, 0, 0)));
            setDeletedOn(new Date(new Date(customer.deletedOn).setHours(0, 0, 0, 0)));
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleShowAddEditDialog = () => setOpenAddEditDialog(true);
    const handleCloseAddEditDialog = () => setOpenAddEditDialog(false);

    const handleShowSuccess = () => setOpenSuccess(true);
    const handleCloseSuccess = () => setOpenSuccess(false);

    const handleShowFailedAddEdit = () => setAddEditFailed(true);
    const handleHideFailedAddEdit = () => setAddEditFailed(false);

    return (
        <>
            <CustomNavbar currentPage={'Customer Information'} />
            <div className='customer-add-edit-container'>
                <div className="customer-add-edit-form">
                    <CustomTextField label={'First Name'} variant={'outlined'} required={true} margin={'normal'} width={'440px'} onChange={e => setFirstName(e.target.value)} value={firstName} error={firstNameError} />
                    <CustomTextField label={'Last Name'} variant={'outlined'} required={true} margin={'normal'} width={'440px'} onChange={e => setLastName(e.target.value)} value={lastName} error={lastNameError} />
                    <CustomTextField label={'Phone Number'} variant={'outlined'} margin={'normal'} onChange={handlePhoneInput} value={phone} required={true} width={'440px'} error={phoneError} />
                    <CustomTextField label={'Email'} variant={'outlined'} margin={'normal'} width={'440px'} onChange={(e) => handleEmailInput(e)} value={email} error={emailError} />
                    <CustomTextField label={'Address'} variant={'outlined'} margin={'normal'} required={true} multiline={true} rows={4} width={'440px'} onChange={e => setAddress(e.target.value)} value={address} error={addressError} />
                    <div className="customer-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"Cancel"} width={"200px"} height={"50px"} margin={'20px 10px 0 0'} onClick={handleOkAndCancel} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Submit"} width={"200px"} height={"50px"} margin={'20px 0 0 10px'} onClick={handleShowAddEditDialog} />
                    </div>
                </div>
            </div>
            <Dialog open={openAddEditDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseAddEditDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    {isEdit ? 'Make Changes to Customer?' : 'Add Customer?'}
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"No"} width={"100px"} height={"45px"} onClick={handleCloseAddEditDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Yes"} width={"100px"} height={"45px"} onClick={handleSubmitCustomer} />
                </DialogActions>
            </Dialog>
            <Dialog open={openSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    {isEdit ? "Customer Edited." : "Customer Added."}
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleOkAndCancel} />
                </DialogActions>
            </Dialog>
            <Snackbar
                open={addEditFailed}
                autoHideDuration={4000}
                onClose={handleHideFailedAddEdit}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                ClickAwayListenerProps={{ onClickAway: () => null }}
            >
                <Alert
                    severity="error"
                    sx={{
                        margin: '20px 0'
                    }}
                    action={(
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleHideFailedAddEdit}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                >
                    {error}
                </Alert>
            </Snackbar>
        </>
    )
}

export default CustomerAddEdit;