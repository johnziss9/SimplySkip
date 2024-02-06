import React, { useEffect, useState } from "react";
import './BookingAddEdit.css';
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomAutocomplete from "../../components/CustomAutocomplete/CustomAutocomplete";
import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker";
import { Alert, Dialog, DialogActions, DialogTitle, FormControlLabel, FormGroup, IconButton, Snackbar, Switch, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CustomSwitch from "../../components/CustomSwitch/CustomSwitch";

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
    const [error, setError] = useState('');
    const [addEditFailed, setAddEditFailed] = useState(false);
    const [useSameAddress, setUseSameAddress] = useState(false);
    const [createdOn, setCreatedOn] = useState(new Date());
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [cancelledOn, setCancelledOn] = useState(new Date());

    const [skipError, setSkipError] = useState(false);
    const [customerError, setCustomerError] = useState(false);
    const [addressError, setAddressError] = useState(false);

    const [returnedSwitchIsOn, setReturnedSwitchIsOn] = useState(false);
    const [paidSwitchIsOn, setPaidSwitchIsOn] = useState(false);

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
    }, [id]);

    const handleFetchBooking = async () => {
        const response = await fetch(`https://localhost:7197/booking/${id}`, {
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
            setCreatedOn(new Date(new Date(booking.createdOn).setHours(0, 0, 0, 0)));
            setLastUpdated(new Date(new Date(booking.lastUpdated).setHours(0, 0, 0, 0)));
            setCancelledOn(new Date(new Date(booking.cancelledOn).setHours(0, 0, 0, 0)));

        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleFetchCustomer = async (id) => {
        const response = await fetch(`https://localhost:7197/customer/${id}`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const customer = await response.json();

            setCustomer(customer);

        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleFetchSkip = async (id) => {
        const response = await fetch(`https://localhost:7197/skip/${id}`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const skip = await response.json();

            setSkip(skip);
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleFetchAvailableSkips = async () => {
        const response = await fetch("https://localhost:7197/skip/available/", {
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
            // TODO Handle error if cards don't load
        }
    }

    const handleSkipStatus = async (id, status) => {
        const response = await fetch(`https://localhost:7197/skip/${id}`, {
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
                deleted: skip.deleted
            })
        });

        if (response.ok) {
            // TODO Check if something gets added here
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleSubmitBooking = async () => {
        if (isEdit) {
            const response = await fetch(`https://localhost:7197/booking/${id}`, {
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
                    lastUpdated: new Date(new Date().setHours(0, 0, 0, 0)),
                    cancelledOn: isCancelled ? new Date(new Date().setHours(0, 0, 0, 0)) : cancelledOn
                })
            });

            if (response.ok) {
                handleCloseAddEditDialog()
                handleShowSuccess();

                // If user edits booking and changes the skip, previous skip becomes available and new one is marked as rented.
                if (skip.id != previousSkipId) {
                    handleSkipStatus(skip.id, true);
                    handleSkipStatus(previousSkipId, false);
                }
                
                // If user edits booking and marks skip as returned, skip becomes available
                if ((!previousIsReturned && isReturned) || isCancelled)
                    handleSkipStatus(previousSkipId, false);

                // Check if isReturned value has changed from false to true
            } else {
                const data = await response.json();

                if (!customer || !skip || !address) {
                    setError('Please fill in required fields.')
                    setSkipError(true);
                    setAddressError(true);
                } else {
                    const { title } = data;

                    setError(title);
                }

                handleShowFailedAddEdit();
            }
        } else {
            const response = await fetch('https://localhost:7197/booking', {
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
                    createdOn: new Date(new Date().setHours(0, 0, 0, 0)),
                    lastUpdated: new Date(new Date().setHours(0, 0, 0, 0)),
                    cancelledOn: new Date(new Date().setHours(0, 0, 0, 0))
                })
            });

            if (response.ok) {
                handleCloseAddEditDialog()
                handleShowSuccess();
                handleSkipStatus(skip.id, true);
            } else {
                const data = await response.json();

                if (!customer || !skip || !address) {
                    setError('Please fill in required fields.')
                    setSkipError(true);
                    setCustomerError(true);
                    setAddressError(true);
                } else {
                    const { title } = data;

                    setError(title);
                }

                handleShowFailedAddEdit();
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

    const handleOkAndCancel = () => {
        navigate(source === 'customer-bookings' ? `/Customer/${customer.id}/Bookings` : '/Bookings');
    }

    const handleShowAddEditDialog = () => setOpenAddEditDialog(true);
    const handleCloseAddEditDialog = () => setOpenAddEditDialog(false);

    const handleShowSuccess = () => setOpenSuccess(true);
    const handleCloseSuccess = () => setOpenSuccess(false);

    const handleShowFailedAddEdit = () => setAddEditFailed(true);
    const handleHideFailedAddEdit = () => setAddEditFailed(false);

    return (
        <>
            <CustomNavbar currentPage={'Booking Information'} />
            <div className='booking-add-edit-container'>
                <div className="booking-add-edit-form">
                    <div className="booking-add-edit-available-skips-container2">
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
                    <CustomAutocomplete fill={'Customers'} value={customer} onChange={(event, newValue) => setCustomer(newValue)} disabled={isEdit ? true : false} error={customerError} />
                    <CustomAutocomplete fill={'Skips'} value={skip} onChange={(event, newValue) => setSkip(newValue)} disabled={isEdit && (!isCancelled && !isPaid && !isReturned) && (hireDate > new Date()) ? true : false} error={skipError} />
                    <CustomDatePicker label={'Hire Date'} value={hireDate} disabled={isEdit && (!isCancelled && !isPaid && !isReturned) && (hireDate > new Date()) ? true : false} onChange={setHireDate} />
                    <FormGroup>
                        <CustomTextField label={'Address'} variant={'outlined'} margin={'normal'} required={true} multiline={true} rows={4} width={'440px'} value={address || ''} onChange={e => setAddress(e.target.value)} error={addressError} disabled={useSameAddress || isEdit && (!isCancelled && !isPaid && !isReturned) && (hireDate > new Date()) ? true : false} />
                        <CustomSwitch disabled={!customer || isEdit && (!isCancelled && !isPaid && !isReturned) && (hireDate > new Date()) ? true : false} onChange={handleSameAddress} label="Use Same Address as Customer" />
                    </FormGroup>
                    <CustomTextField label={'Notes'} variant={'outlined'} margin={'normal'} required={false} multiline={true} rows={4} width={'440px'} value={notes || ''} onChange={e => setNotes(e.target.value)} />
                    <div className="booking-add-edit-switches">
                        <CustomSwitch disabled={(isReturned && !returnedSwitchIsOn) || !isEdit} checked={returnedSwitchIsOn} onChange={(e) => handleReturnSwitchChange(e)} label="Returned" />
                        <CustomSwitch disabled={(isPaid && !paidSwitchIsOn)} checked={paidSwitchIsOn} onChange={(e) => handlePaidSwitchChange(e)} label="Paid" />
                        <CustomSwitch disabled={!isEdit} checked={isCancelled} onChange={(e) => setIsCancelled(e.target.checked)} label="Cancelled" />
                    </div>
                    <div className="booking-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"Cancel"} width={"200px"} height={"50px"} margin={'20px 10px 0 0'} onClick={handleOkAndCancel} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Submit"} width={"200px"} height={"50px"} margin={'20px 0 0 10px'} onClick={handleShowAddEditDialog} />
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

export default BookingAddEdit;