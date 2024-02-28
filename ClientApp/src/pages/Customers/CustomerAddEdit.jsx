import React, { useEffect, useState } from "react";
import './CustomerAddEdit.css';
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomButton from "../../components/CustomButton/CustomButton";
import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from "@mui/material";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import handleHttpRequest from "../../api/api";

function CustomerAddEdit() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [createdOn, setCreatedOn] = useState(new Date());
    const [deletedOn, setDeletedOn] = useState(new Date());

    const [isValidEmail, setIsValidEmail] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
    const [openBookingsAddressDialog, setOpenBookingsAddressDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [customer, setCustomer] = useState({});
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [previousAddress, setPreviousAddress] = useState('');

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const fieldsWidth = useMediaQuery('(max-width: 500px)');

    useEffect(() => {
        if (id) {
            handleFetchCustomer();

            setIsEdit(true);
        }
        // eslint-disable-next-line
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
            setSnackbarMessage("Please enter a valid email address");
            setEmailError(true);
            setShowSnackbar(true);
            return; // Stop further execution if email is not valid
        }

        if (isEdit) {
            const url = `/customer/${id}`;
            const method = 'PUT';
            const body = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                address: address.replace(/\n/g, ', '),
                createdOn: createdOn,
                lastUpdated: new Date(new Date()),
                deletedOn: deletedOn
            };

            const { success } = await handleHttpRequest(url, method, body);

            if (success) {
                handleCloseAddEditDialog()
                handleShowSuccess();

                if (previousAddress !== address)
                    handleFutureBookingAddress();
            } else {
                if (!firstName || !lastName || !address || !phone) {
                    setSnackbarMessage('Please fill in required fields.')
                    setFirstNameError(true);
                    setLastNameError(true);
                    setAddressError(true);
                    setPhoneError(true);
                } else {
                    setSnackbarMessage('Failed to add booking.');
                }

                setShowSnackbar(true);
            }
        } else {
            const url = '/customer/';
            const method = 'POST';
            const body = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                address: address.replace(/\n/g, ', '),
                deleted: false,
                createdOn: new Date(new Date()),
                lastUpdated: new Date(new Date()),
                deletedOn: new Date(new Date())
            };

            const { success } = await handleHttpRequest(url, method, body);

            if (success) {
                handleCloseAddEditDialog()
                handleShowSuccess();
            } else {
                if (!firstName || !lastName || !address || !phone) {
                    setSnackbarMessage('Please fill in required fields.')
                    setFirstNameError(true);
                    setLastNameError(true);
                    setAddressError(true);
                    setPhoneError(true);
                } else {
                    setSnackbarMessage('Failed to add booking.');
                }

                setShowSnackbar(true);
            }
        }
    }

    const handleOkAndCancel = () => {
        navigate('/Customers');
    };

    const handleFetchCustomer = async () => {
        const url = `/customer/${id}`;
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            setCustomer(data);

            setFirstName(data.firstName);
            setLastName(data.lastName);
            setPhone(data.phone);
            setAddress(data.address.replace(/, /g, '\n'));
            setPreviousAddress(data.address);
            setEmail(data.email);
            setCreatedOn(new Date(new Date(data.createdOn)));
            setDeletedOn(new Date(new Date(data.deletedOn)));
        } else {
            setSnackbarMessage('Failed to load customer.');
            setShowSnackbar(true);
        }
    };

    const handleFutureBookingAddress = async () => {
        const url = `/booking/customer/${customer.id}`;
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            const futureBookings = data.filter(booking => new Date(booking.hireDate) > new Date());

            if (futureBookings.length > 0)
                handleShowBookingsAddressDialog()
        } else {
            setSnackbarMessage('Failed to load bookings.');
            setShowSnackbar(true);
        }
    };

    const handleViewBookings = () => {
        navigate(`/Customer/${customer.id}/Bookings`);
    }

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage('');
    };

    const handleShowAddEditDialog = () => setOpenAddEditDialog(true);
    const handleCloseAddEditDialog = () => setOpenAddEditDialog(false);

    const handleShowSuccess = () => setOpenSuccess(true);
    const handleCloseSuccess = () => setOpenSuccess(false);

    const handleShowBookingsAddressDialog = () => setOpenBookingsAddressDialog(true);
    const handleCloseBookingsAddressDialog = () => setOpenBookingsAddressDialog(false);

    return (
        <>
            <CustomNavbar currentPage={'Customer Information'} />
            <div className='customer-add-edit-container'>
                <div className="customer-add-edit-form">
                    <CustomTextField label={'First Name'} variant={'outlined'} required={true} margin={'normal'} width={fieldsWidth ? '300px' : '440px'} onChange={e => setFirstName(e.target.value)} value={firstName} error={firstNameError} />
                    <CustomTextField label={'Last Name'} variant={'outlined'} required={true} margin={'normal'} width={fieldsWidth ? '300px' : '440px'} onChange={e => setLastName(e.target.value)} value={lastName} error={lastNameError} />
                    <CustomTextField label={'Phone Number'} variant={'outlined'} margin={'normal'} onChange={handlePhoneInput} value={phone} required={true} width={fieldsWidth ? '300px' : '440px'} error={phoneError} />
                    <CustomTextField label={'Email'} variant={'outlined'} margin={'normal'} width={fieldsWidth ? '300px' : '440px'} onChange={(e) => handleEmailInput(e)} value={email} error={emailError} />
                    <CustomTextField label={'Address'} variant={'outlined'} margin={'normal'} required={true} multiline={true} rows={4} width={fieldsWidth ? '300px' : '440px'} onChange={e => setAddress(e.target.value)} value={address} error={addressError} />
                    <div className="customer-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"Cancel"} width={"200px"} height={"50px"} margin={fieldsWidth ? '20px 0' : '20px 10px 0 0'} onClick={handleOkAndCancel} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Submit"} width={"200px"} height={"50px"} margin={fieldsWidth ? '0 0 20px 0' : '20px 0 0 10px'} onClick={handleShowAddEditDialog} />
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
            <Dialog open={openBookingsAddressDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseBookingsAddressDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    Customer Address Changed
                </DialogTitle>
                <DialogContent>
                    Future bookings found with the same address as the customer. Make sure they are changed.
                </DialogContent>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Later"} width={"100px"} height={"45px"} onClick={handleCloseBookingsAddressDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Go To Bookings"} width={"150px"} height={"45px"} onClick={handleViewBookings} />
                </DialogActions>
            </Dialog>
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity="error" />
        </>
    )
}

export default CustomerAddEdit;