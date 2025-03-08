import React, { useEffect, useState } from "react";
import './CustomerAddEdit.css';
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomButton from "../../components/CustomButton/CustomButton";
import { Dialog, DialogActions, DialogTitle, useMediaQuery } from "@mui/material";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import handleHttpRequest from "../../api/api";

function CustomerAddEdit() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [createdOn, setCreatedOn] = useState(new Date());
    const [deletedOn, setDeletedOn] = useState(new Date());

    const [isValidEmail, setIsValidEmail] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [customer, setCustomer] = useState({});
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
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

    const validateEmail = (email) => {
        if (!email || email.trim() === "") {
            return true;
        }
        
        return /^[a-zA-Z0-9._-]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleEmailInput = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        setIsValidEmail(validateEmail(newEmail));
    };

    const handleSubmitCustomer = async () => {
        // Reset error states
        setFirstNameError(false);
        setLastNameError(false);
        setPhoneError(false);
        setEmailError(false);
    
        if (!isValidEmail && email !== null && email.trim() !== "") {
            setSnackbarMessage("Η μορφἠ του email είναι λανθασμένη.");
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
                createdOn: createdOn,
                lastUpdated: new Date(new Date()),
                deletedOn: deletedOn
            };
    
            const response = await handleHttpRequest(url, method, body);
    
            if (response.success) {
                handleAddAuditLogEntry(`Επεξεργασἰα πελἀτη ${lastName}, ${firstName}.`);
                handleCloseAddEditDialog();
                handleShowSuccess();
            } else {
                handleCloseAddEditDialog();
                
                // Check for duplicate phone number error
                if (response.error && response.error.status === 400 && 
                    response.error.title === "Customer with this phone number already exists") {
                    setSnackbarMessage('Υπάρχει ήδη πελάτης με αυτό το τηλέφωνο.');
                    setPhoneError(true);
                } else if (!firstName || !lastName || !phone) {
                    setSnackbarMessage('Συμπληρώστε τα απαραίτητα πεδία.')
                    setFirstNameError(!firstName);
                    setLastNameError(!lastName);
                    setPhoneError(!phone);
                } else {
                    setSnackbarMessage('Αποτυχία επεξεργασίας πελάτη.');
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
                deleted: false,
                createdOn: new Date(new Date()),
                lastUpdated: new Date(new Date()),
                deletedOn: new Date(new Date())
            };
    
            const response = await handleHttpRequest(url, method, body);
    
            if (response.success) {
                handleAddAuditLogEntry(`Αποθὐκευση πελἀτη ${lastName}, ${firstName}.`);
                handleCloseAddEditDialog();
                handleShowSuccess();
            } else {
                handleCloseAddEditDialog();
                
                // Check for duplicate phone number error
                if (response.error && response.error.status === 400 && 
                    response.error.title === "Customer with this phone number already exists") {
                    setSnackbarMessage('Υπάρχει ήδη πελάτης με αυτό το τηλέφωνο.');
                    setPhoneError(true);
                } else if (!firstName || !lastName || !phone) {
                    setSnackbarMessage('Συμπληρώστε τα απαραίτητα πεδία.')
                    setFirstNameError(!firstName);
                    setLastNameError(!lastName);
                    setPhoneError(!phone);
                } else {
                    setSnackbarMessage('Αποτυχία προσθήκης πελάτη.');
                }
    
                setShowSnackbar(true);
            }
        }
    };

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
            setEmail(data.email);
            setIsValidEmail(validateEmail(data.email));
            setCreatedOn(new Date(new Date(data.createdOn)));
            setDeletedOn(new Date(new Date(data.deletedOn)));
        } else {
            setSnackbarMessage('Failed to load customer.');
            setShowSnackbar(true);
        }
    };

    const handleAddAuditLogEntry = async (action) => {
        const url = '/auditLog/';
        const method = 'POST';
        const body = {
            userId: sessionStorage.getItem('userId'),
            username: sessionStorage.getItem('username'),
            action: action
        };

        const { success } = await handleHttpRequest(url, method, body);

        if (!success) {
            setSnackbarMessage('Failed to add audit log.');
            setShowSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage('');
    };

    const handleShowAddEditDialog = () => setOpenAddEditDialog(true);
    const handleCloseAddEditDialog = () => setOpenAddEditDialog(false);

    const handleShowSuccess = () => setOpenSuccess(true);
    const handleCloseSuccess = () => setOpenSuccess(false);

    return (
        <>
            <CustomNavbar currentPage={'Πληροφορίες Πελάτη'} />
            <div className='customer-add-edit-container'>
                <div className="customer-add-edit-form">
                    <CustomTextField label={'Ὀνομα'} variant={'outlined'} required={true} margin={'normal'} width={fieldsWidth ? '300px' : '440px'} onChange={e => setFirstName(e.target.value)} value={firstName} error={firstNameError} />
                    <CustomTextField label={'Επὠνυμο'} variant={'outlined'} required={true} margin={'normal'} width={fieldsWidth ? '300px' : '440px'} onChange={e => setLastName(e.target.value)} value={lastName} error={lastNameError} />
                    <CustomTextField label={'Τηλἐφωνο'} variant={'outlined'} margin={'normal'} onChange={handlePhoneInput} value={phone} required={true} width={fieldsWidth ? '300px' : '440px'} error={phoneError} />
                    <CustomTextField label={'Email'} variant={'outlined'} margin={'normal'} width={fieldsWidth ? '300px' : '440px'} onChange={(e) => handleEmailInput(e)} value={email} error={emailError} />
                    <div className="customer-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"ΑΚΥΡΩΣΗ"} width={"200px"} height={"50px"} margin={fieldsWidth ? '20px 0' : '20px 10px 0 0'} onClick={handleOkAndCancel} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"ΑΠΟΘΗΚΕΥΣΗ"} width={"200px"} height={"50px"} margin={fieldsWidth ? '0 0 20px 0' : '20px 0 0 10px'} onClick={handleShowAddEditDialog} />
                    </div>
                </div>
            </div>
            <Dialog open={openAddEditDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseAddEditDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    {isEdit ? 'Αποθήκευση αλλαγών στον πελἀτη;' : 'Αποθήκευση Πελἀτη;'}
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"ΟΧΙ"} width={"100px"} height={"45px"} onClick={handleCloseAddEditDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"ΝΑΙ"} width={"100px"} height={"45px"} onClick={handleSubmitCustomer} />
                </DialogActions>
            </Dialog>
            <Dialog open={openSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    {isEdit ? "Ο Πελἀτης επεξεργάστηκε." : "Ο Πελἀτης αποθηκεύτηκε."}
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleOkAndCancel} />
                </DialogActions>
            </Dialog>
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity="error" />
        </>
    )
}

export default CustomerAddEdit;