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

    const baseUrl = process.env.REACT_APP_URL;

    useEffect(() => {
        if (id) {
            handleFetchBooking();

            setIsEdit(true);
        }

        // Check if customerId exists in localStorage
        const customerId = localStorage.getItem('CustomerId');

        if (customerId != null) {
            handleFetchCustomer(customerId);
            localStorage.clear();
        }

        handleFetchAvailableSkips();
        // eslint-disable-next-line
    }, [id]);

    const handleFetchBooking = async () => {
        const response = await fetch(`${baseUrl}/booking/${id}`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const booking = await response.json();

            handleFetchCustomer(booking.customerId);
            handleFetchSkip(booking.skipId);
            setPreviousSkipId(booking.skipId); // This is to be used only if there's a skip change on edit
            setHireDate(new Date(new Date(booking.hireDate).setHours(0, 0, 0, 0)));
            setReturnDate(new Date(new Date(booking.returnDate).setHours(0, 0, 0, 0)));
            setAddress(booking.address.replace(/, /g, '\n'));
            setNotes(booking.notes.replace(/, /g, '\n'));
            setIsReturned(booking.returned);
            setPreviousIsReturned(booking.returned); // This is to be used only if there's a skip change on edit
            setIsPaid(booking.paid);
            setIsCancelled(booking.cancelled);
            setCreatedOn(new Date(new Date(booking.createdOn)));
            setCancelledOn(new Date(new Date(booking.cancelledOn)));

        } else {
            setSnackbarMessage('Failed to load bookings.');
            setShowSnackbar(true);
        }
    }

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
        const response = await fetch(`${baseUrl}/skip/${id}`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const skip = await response.json();

            setSkip(skip);
        } else {
            setSnackbarMessage('Failed to load skip.'); 
            setShowSnackbar(true);
        }
    }

    const handleFetchAvailableSkips = async () => {
        const response = await fetch(`${baseUrl}/skip/available/`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const data = await response.json();

            setSmallSkips(data.filter(skip => skip.size === 1).length);
            setLargeSkips(data.filter(skip => skip.size === 2).length);
        } else {
            setSnackbarMessage('Failed to load available skips.'); 
            setShowSnackbar(true);
        }
    }

    const handleSkipStatus = async (id, status) => {
        const response = await fetch(`${baseUrl}/skip/${id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                name: skip.name,
                size: skip.size,
                notes: skip.notes,
                rented: status,
                deleted: skip.deleted,
                createdOn: skip.createdOn,
                lastUpdated: new Date(new Date()),
                deleteOn: skip.deleteOn
            })
        });

        if (response.ok) {
            setSnackbarMessage(`Skip ${skip.name} has been updated.`); 
            setSnackbarSuccess(true);
            setShowSnackbar(true);
        } else {
            setSnackbarMessage(`Failed to update skip ${skip.name}.`);
            setShowSnackbar(true);
        }
    }

    const handleSubmitBooking = async () => {
        if (isEdit) {
            const response = await fetch(`${baseUrl}/booking/${id}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
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
                })
            });

            if (response.ok) {
                handleCloseAddEditDialog()
                handleShowSuccess();

                // If user edits booking and changes the skip, previous skip becomes available and new one is marked as rented.
                if (skip.id !== previousSkipId) {
                    handleSkipStatus(skip.id, true);
                    handleSkipStatus(previousSkipId, false);
                }
                
                // If user edits booking and marks skip as returned, skip becomes available
                if ((!previousIsReturned && isReturned) || isCancelled)
                    handleSkipStatus(previousSkipId, false);

                // Check if isReturned value has changed from false to true
            } else {
                if (!skip || !address) {
                    setSnackbarMessage('Please fill in required fields.')
                    setSkipError(true);
                    setAddressError(true);
                } else {
                    setSnackbarMessage('Failed to update booking.');
                }

                setShowSnackbar(true);
                handleCloseAddEditDialog();
            }
        } else {
            const response = await fetch(`${baseUrl}/booking`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
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
                })
            });

            if (response.ok) {
                handleCloseAddEditDialog()
                handleShowSuccess();
                handleSkipStatus(skip.id, true);
            } else {

                if (!customer || !skip || !address) {
                    setSnackbarMessage('Please fill in required fields.')
                    setSkipError(true);
                    setCustomerError(true);
                    setAddressError(true);
                } else {
                    setSnackbarMessage('Failed to add booking.');
                }

                setShowSnackbar(true);
                handleCloseAddEditDialog();
            }
        }
    }

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

    const today = dayjs();

    return (
        <>
            <CustomNavbar currentPage={'Booking Information'} />
            <div className='booking-add-edit-container'>
                <div className="booking-add-edit-form">
                    <div className="booking-add-edit-available-skips-container">
                        <Typography variant="h6" sx={{ width: '160px' }}>
                            Available Skips:
                        </Typography>
                        <Typography variant="h5" sx={{ width: '100px', textAlign: 'center' }}>
                            {smallSkips} Small
                        </Typography>
                        <Typography variant="h5" sx={{ width: '100px', textAlign: 'center' }}>
                            {largeSkips} Large
                        </Typography>
                    </div>
                    <CustomAutocomplete fill={'Customers'} value={customer} onChange={(event, newValue) => setCustomer(newValue)} disabled={isEdit ? true : false} error={customerError} width={fieldsWidth ? '300px' : '440px'} />
                    <CustomAutocomplete fill={'Skips'} value={skip} onChange={(event, newValue) => setSkip(newValue)} disabled={isEdit && (!isCancelled && !isPaid && !isReturned) && (hireDate < new Date()) ? true : false} error={skipError} width={fieldsWidth ? '300px' : '440px'} />
                    <CustomDatePicker label={'Hire Date'} value={hireDate} disabled={isEdit && (!isCancelled && !isPaid && !isReturned) && hireDate < new Date()} minDate={isEdit && (!isCancelled && !isPaid && !isReturned) && hireDate > new Date() ? today : null} onChange={setHireDate} width={fieldsWidth ? '300px' : '440px'} />
                    <FormGroup>
                        <CustomTextField label={'Address'} variant={'outlined'} margin={'normal'} required={true} multiline={true} rows={4} width={fieldsWidth ? '300px' : '440px'} value={address || ''} onChange={e => setAddress(e.target.value)} error={addressError} disabled={useSameAddress || (isEdit && (!isCancelled && !isPaid && !isReturned) && (hireDate < new Date())) || isCustomerAddressSameAsBookingAddress() ? true : false} />
                        <CustomSwitch checked={isCustomerAddressSameAsBookingAddress()} disabled={!customer || (isEdit && (!isCancelled && !isPaid && !isReturned) && hireDate < new Date())} onChange={handleSameAddress} label="Use Same Address as Customer" />
                    </FormGroup>
                    <CustomTextField label={'Notes'} variant={'outlined'} margin={'normal'} required={false} multiline={true} rows={4} width={fieldsWidth ? '300px' : '440px'} value={notes || ''} onChange={e => setNotes(e.target.value)} />
                    <div className="booking-add-edit-switches">
                        <CustomSwitch disabled={(isReturned && !returnedSwitchIsOn) || !isEdit} checked={returnedSwitchIsOn || isReturned} onChange={(e) => handleReturnSwitchChange(e)} label="Returned" />
                        <CustomSwitch disabled={(isPaid && !paidSwitchIsOn)} checked={paidSwitchIsOn || isPaid} onChange={(e) => handlePaidSwitchChange(e)} label="Paid" />
                        <CustomSwitch disabled={!isEdit || hireDate <= new Date()} checked={isCancelled || isCancelled} onChange={(e) => setIsCancelled(e.target.checked)} label="Cancelled" />
                    </div>
                    <div className="booking-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"Cancel"} width={"200px"} height={"50px"} margin={fieldsWidth ? '20px 0' : '20px 10px 0 0'} onClick={handleOkAndCancel} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Submit"} width={"200px"} height={"50px"} margin={fieldsWidth ? '0 0 20px 0' : '20px 0 0 10px'} onClick={handleShowAddEditDialog} />
                    </div>
                </div>
            </div>
            <Dialog open={openAddEditDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseAddEditDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    {isEdit ? 'Make Changes to Booking?' : 'Add Booking?'}
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"No"} width={"100px"} height={"45px"} onClick={handleCloseAddEditDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Yes"} width={"100px"} height={"45px"} onClick={handleSubmitBooking} />
                </DialogActions>
            </Dialog>
            <Dialog open={openSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    {isEdit ? "Booking Edited." : "Booking Added."}
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