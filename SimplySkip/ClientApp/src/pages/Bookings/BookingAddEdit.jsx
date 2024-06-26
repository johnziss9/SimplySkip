import React, { useEffect, useState } from "react";
import './BookingAddEdit.css';
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomAutocomplete from "../../components/CustomAutocomplete/CustomAutocomplete";
import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker";
import { Dialog, DialogActions, DialogTitle, FormGroup, Typography, useMediaQuery } from "@mui/material";
import CustomSwitch from "../../components/CustomSwitch/CustomSwitch";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import dayjs from 'dayjs';
import handleHttpRequest from "../../api/api";

function BookingAddEdit() {

    const navigate = useNavigate();

    const { id, source } = useParams();

    const [isEdit, setIsEdit] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openAddEditDialog, setOpenAddEditDialog] = useState(false);

    const [customer, setCustomer] = useState(null);
    const [skip, setSkip] = useState(null);
    const [previousSkipId, setPreviousSkipId] = useState(null); // Used for handling skip status
    const [smallSkips, setSmallSkips] = useState(0);
    const [largeSkips, setLargeSkips] = useState(0);
    const [hireDate, setHireDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [isReturned, setIsReturned] = useState(false);
    const [previousIsReturned, setPreviousIsReturned] = useState(false); // Used for handling skip status
    const [isPaid, setIsPaid] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState(''); 
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarSuccess, setSnackbarSuccess] = useState(false); // Used to change snackbar alert severity
    const [useSameAddress, setUseSameAddress] = useState(false);
    const [createdOn, setCreatedOn] = useState(new Date());
    const [cancelledOn, setCancelledOn] = useState(new Date());

    const [skipError, setSkipError] = useState(false);
    const [customerError, setCustomerError] = useState(false);
    const [addressError, setAddressError] = useState(false);

    const [returnedSwitchIsOn, setReturnedSwitchIsOn] = useState(false);
    const [paidSwitchIsOn, setPaidSwitchIsOn] = useState(false);

    const fieldsWidth = useMediaQuery('(max-width: 500px)');

    useEffect(() => {
        if (id) {
            handleFetchBooking();

            setIsEdit(true);
        }

        // This is used for setting the customer when adding a new booking from the customer's booking page.
        // Getting the customer id from the localStorage and the calling the handleFetchCustomer to set it as well as clearing the localStoreage.
        const customerId = localStorage.getItem('CustomerId');

        if (customerId != null) {
            handleFetchCustomer(customerId);
            localStorage.clear();
        }

        handleFetchAvailableSkips();
        // eslint-disable-next-line
    }, [id]);

    const handleFetchBooking = async () => {
        const url = `/booking/${id}`;
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            handleFetchCustomer(data.customerId);
            handleFetchSkip(data.skipId);
            setPreviousSkipId(data.skipId); // This is to be used only if there's a skip change on edit
            setHireDate(new Date(new Date(data.hireDate).setHours(0, 0, 0, 0)));
            setReturnDate(new Date(new Date(data.returnDate).setHours(0, 0, 0, 0)));
            setAddress(data.address.replace(/, /g, '\n'));
            setNotes(data.notes.replace(/, /g, '\n'));
            setIsReturned(data.returned);
            setPreviousIsReturned(data.returned); // This is to be used only if there's a skip change on edit
            setIsPaid(data.paid);
            setIsCancelled(data.cancelled);
            setCreatedOn(new Date(new Date(data.createdOn)));
            setCancelledOn(new Date(new Date(data.cancelledOn)));
        } else {
            setSnackbarMessage('Failed to load bookings.');
            setShowSnackbar(true);
        }
    };

    const handleFetchCustomer = async (id) => {
        const url = `/customer/${id}`;
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            setCustomer(data);
        } else {
            setSnackbarMessage('Failed to load customer.');
            setShowSnackbar(true);
        }
    };

    const handleFetchSkip = async (id) => {
        const url = `/skip/${id}`;
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            setSkip(data);
        } else {
            setSnackbarMessage('Failed to load skip.');
            setShowSnackbar(true);
        }
    };

    const handleFetchAvailableSkips = async () => {
        const url = '/skip/available/';
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            setSmallSkips(data.filter(skip => skip.size === 1).length);
            setLargeSkips(data.filter(skip => skip.size === 2).length);
        } else {
            setSnackbarMessage('Failed to load available skips.'); 
            setShowSnackbar(true);
        }
    };

    const handleSkipStatus = async (id, status) => {
        const url = `/skip/${id}`;
        const method = 'PUT';
        const body = {
            name: skip.name,
            size: skip.size,
            notes: skip.notes,
            rented: status,
            deleted: skip.deleted,
            createdOn: skip.createdOn,
            lastUpdated: new Date(new Date()),
            deleteOn: skip.deleteOn
        };

        const { success } = await handleHttpRequest(url, method, body);

        if (success) {
            setSnackbarMessage(`Το Skip ${skip.name} εἰναι τὠρα ${status ? 'κρατημἐνο.' : 'διαθἐσιμο.'}`); 
            setSnackbarSuccess(true);
            setShowSnackbar(true);
        } else {
            setSnackbarMessage(`Failed to update skip ${skip.name}.`);
            setShowSnackbar(true);
        }
    };

    const handleSubmitBooking = async () => {
        if (isEdit) {
            const url = `/booking/${id}`;
            const method = 'PUT';
            const body = {
                customerId: customer.id,
                skipId: skip.id,
                hireDate: hireDate,
                returnDate: returnDate,
                address: address.replace(/\n/g, ', '),
                notes: notes.replace(/\n/g, ', '),
                returned: isReturned,
                paid: isPaid,
                cancelled: isCancelled,
                createdOn: createdOn,
                lastUpdated: new Date(new Date()),
                cancelledOn: isCancelled ? new Date(new Date()) : cancelledOn
            };

            const { success } = await handleHttpRequest(url, method, body);

            if (success) {
                handleAddAuditLogEntry(`Επεξεργασἰα κρἀτησης για τον πελἀτη ${customer.lastName}, ${customer.firstName}.`);
                handleCloseAddEditDialog();
                handleShowSuccess();

                // If user edits booking and changes the skip, previous skip becomes available and new one is marked as rented.
                if (skip.id !== previousSkipId) {
                    handleSkipStatus(skip.id, true);
                    handleSkipStatus(previousSkipId, false);
                }
                
                // If user edits booking and marks skip as returned, skip becomes available
                if ((!previousIsReturned && isReturned) || isCancelled)
                    handleSkipStatus(previousSkipId, false);
            } else {
                handleCloseAddEditDialog();
                if (!skip || !address) {
                    setSnackbarMessage('Συμπληρώστε τα απαραίτητα πεδία.')
                    setSkipError(true);
                    setAddressError(true);
                } else {
                    setSnackbarMessage('Failed to update booking.');
                }

                setShowSnackbar(true);
            }
        } else {
            const url = '/booking/';
            const method = 'POST';
            const body = {
                customerId: customer ? customer.id : null,
                skipId: skip ? skip.id : null,
                hireDate: new Date(new Date(hireDate).setHours(0, 0, 0, 0)),
                returnDate: new Date(new Date().setHours(0, 0, 0, 0)),
                address: address.replace(/\n/g, ', '),
                notes: notes.replace(/\n/g, ', '),
                returned: isReturned,
                paid: isPaid,
                cancelled: isCancelled,
                createdOn: new Date(new Date()),
                lastUpdated: new Date(new Date()),
                cancelledOn: new Date(new Date())
            };

            const { success } = await handleHttpRequest(url, method, body);

            if (success) {
                handleAddAuditLogEntry(`Αποθἠκευση κρἀτησης για τον πελἀτη ${customer.lastName}, ${customer.firstName}.`);
                handleCloseAddEditDialog()
                handleShowSuccess();
                handleSkipStatus(skip.id, true);
            } else {
                handleCloseAddEditDialog()
                if (!customer || !skip || !address) {
                    setSnackbarMessage('Συμπληρώστε τα απαραίτητα πεδία.')
                    setSkipError(true);
                    setCustomerError(true);
                    setAddressError(true);
                } else {
                    setSnackbarMessage('Failed to add booking.');
                }

                setShowSnackbar(true);
            }
        }
    }

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

    const handleReturnSwitchChange = (e) => {
        setIsReturned(e.target.checked);
        setReturnDate(new Date(new Date().setHours(0, 0, 0, 0)));
        setReturnedSwitchIsOn(e.target.checked);
    }

    const handlePaidSwitchChange = (e) => {
        setIsPaid(e.target.checked)
        setPaidSwitchIsOn(e.target.checked);
    }

    const handleSameAddress = () => {
        setUseSameAddress(!useSameAddress);

        if (!useSameAddress) {
            setAddress(customer.address.replace(/, /g, '\n'));
        } else {
            setAddress('');
        }
    }

    const isCustomerAddressSameAsBookingAddress = () => {
        return (customer && customer.address === address)
    };

    const handleOkAndCancel = () => {
        const addNewSource = sessionStorage.getItem('AddNewSource');

        navigate(source === 'customer-bookings' || addNewSource === 'customer-bookings' ? `/Customer/${customer.id}/Bookings` : '/Bookings');
        sessionStorage.removeItem('AddNewSource');
    }

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage('');
        setSnackbarSuccess(false);
    };

    const handleShowAddEditDialog = () => setOpenAddEditDialog(true);
    const handleCloseAddEditDialog = () => setOpenAddEditDialog(false);

    const handleShowSuccess = () => setOpenSuccess(true);
    const handleCloseSuccess = () => setOpenSuccess(false);

    const setMinDate = dayjs().add(1, 'day');

    return (
        <>
            <CustomNavbar currentPage={'Πληροφορἰες Κρἀτησης'} />
            <div className='booking-add-edit-container'>
                <div className="booking-add-edit-form">
                    <div className="booking-add-edit-available-skips-container">
                        <Typography variant="h6" sx={{ width: '110px', '@media (max-width: 500px)': { width: '180px', textAlign: 'center' } }}>
                            Διαθέσιμα Skips:
                        </Typography>
                        <Typography variant="h5" sx={{ width: '150px', textAlign: 'center' }}>
                            {smallSkips} {smallSkips === 1 ? 'Μικρὀ' : 'Μικρἀ'}
                        </Typography>
                        <Typography variant="h5" sx={{ width: '150px', textAlign: 'center' }}>
                            {largeSkips} {largeSkips === 1 ? 'Μεγἀλο' : 'Μεγἀλα'}
                        </Typography>
                    </div>
                    <CustomAutocomplete fill={'Customers'} value={customer} onChange={(event, newValue) => setCustomer(newValue)} disabled={isEdit ? true : false} error={customerError} width={fieldsWidth ? '300px' : '440px'} />
                    <CustomAutocomplete fill={'Skips'} value={skip} onChange={(event, newValue) => setSkip(newValue)} disabled={isEdit && (!isCancelled && !isPaid && !isReturned) && (hireDate < new Date()) ? true : false} error={skipError} width={fieldsWidth ? '300px' : '440px'} />
                    <CustomDatePicker label={'Ημερομηνία Κρἀτησης'} value={hireDate} disabled={isEdit && (!isCancelled && !isPaid && !isReturned) && hireDate < new Date()} minDate={isEdit && (!isCancelled && !isPaid && !isReturned) && hireDate > new Date() ? setMinDate : null} onChange={setHireDate} width={fieldsWidth ? '300px' : '440px'} />
                    <FormGroup sx={{ width: fieldsWidth ? '300px' : '440px' }}>
                        <CustomTextField label={'Διεὐθυνση'} variant={'outlined'} margin={'normal'} required={true} multiline={true} rows={4} value={address || ''} onChange={e => setAddress(e.target.value)} error={addressError} disabled={useSameAddress || (isEdit && (!isCancelled && !isPaid && !isReturned) && (hireDate < new Date())) || isCustomerAddressSameAsBookingAddress() ? true : false} />
                        <CustomSwitch checked={isCustomerAddressSameAsBookingAddress()} disabled={!customer || (isEdit && (!isCancelled && !isPaid && !isReturned) && hireDate < new Date())} onChange={handleSameAddress} label="Χρήση της ίδιας διεύθυνσης απὀ πελάτη." />
                    </FormGroup>
                    <CustomTextField label={'Σημειώσεις'} variant={'outlined'} margin={'normal'} required={false} multiline={true} rows={4} width={fieldsWidth ? '300px' : '440px'} value={notes || ''} onChange={e => setNotes(e.target.value)} />
                    <div className="booking-add-edit-switches">
                        <CustomSwitch disabled={(isReturned && !returnedSwitchIsOn) || !isEdit} checked={returnedSwitchIsOn || isReturned} onChange={(e) => handleReturnSwitchChange(e)} label="Επιστράφηκε" />
                        <CustomSwitch disabled={(isPaid && !paidSwitchIsOn)} checked={paidSwitchIsOn || isPaid} onChange={(e) => handlePaidSwitchChange(e)} label="Πληρώθηκε" />
                        <CustomSwitch disabled={!isEdit || hireDate <= new Date()} checked={isCancelled || isCancelled} onChange={(e) => setIsCancelled(e.target.checked)} label="Ακυρώθηκε" />
                    </div>
                    <div className="booking-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"ΑΚΥΡΩΣΗ"} width={"200px"} height={"50px"} margin={fieldsWidth ? '20px 0' : '20px 10px 0 0'} onClick={handleOkAndCancel} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"ΑΠΟΘΗΚΕΥΣΗ"} width={"200px"} height={"50px"} margin={fieldsWidth ? '0 0 20px 0' : '20px 0 0 10px'} onClick={handleShowAddEditDialog} />
                    </div>
                </div>
            </div>
            <Dialog open={openAddEditDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseAddEditDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    {isEdit ? 'Αποθήκευση αλλαγών στην κράτηση;' : 'Αποθήκευση κρἀτησης;'}
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"No"} width={"100px"} height={"45px"} onClick={handleCloseAddEditDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Yes"} width={"100px"} height={"45px"} onClick={handleSubmitBooking} />
                </DialogActions>
            </Dialog>
            <Dialog open={openSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    {isEdit ? "Η κράτηση επεξεργάστηκε." : "Η κράτηση αποθηκεύτηκε."}
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleOkAndCancel} />
                </DialogActions>
            </Dialog>
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity={snackbarSuccess ? 'success' : 'error'} />
        </>
    )
}

export default BookingAddEdit;