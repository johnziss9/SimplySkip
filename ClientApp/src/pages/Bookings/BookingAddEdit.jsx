import React, { useEffect, useState } from "react";
import './BookingAddEdit.css';
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomAutocomplete from "../../components/CustomAutocomplete/CustomAutocomplete";
import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker";
import { Alert, Dialog, DialogActions, DialogTitle, FormControlLabel, IconButton, Snackbar, Switch } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function BookingAddEdit() {

    const navigate = useNavigate();

    const { id, source } = useParams();

    const [isEdit, setIsEdit] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);

    const [customer, setCustomer] = useState(null);
    const [skip, setSkip] = useState(null);
    const [hireDate, setHireDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [isReturned, setIsReturned] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState('');
    const [addEditFailed, setAddEditFailed] = useState(false);

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
            setHireDate(new Date(booking.hireDate));
            setReturnDate(new Date(booking.returnDate));
            setAddress(booking.address);
            setNotes(booking.notes);
            setIsReturned(booking.returned);
            setIsPaid(booking.paid);
            setIsCancelled(booking.cancelled);

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
                    address: address,
                    notes: notes,
                    returned: isReturned,
                    paid: isPaid,
                    cancelled: isCancelled
                })
            });

            if (response.ok) {
                handleShowSuccess();
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
                    hireDate: hireDate,
                    returnDate: new Date(),
                    address: address,
                    notes: notes,
                    returned: isReturned,
                    paid: isPaid,
                    cancelled: isCancelled
                })
            });

            if (response.ok) {
                handleShowSuccess();
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
        setReturnDate(new Date());
        setReturnedSwitchIsOn(e.target.checked);
    }

    const handlePaidSwitchChange = (e) => {
        setIsPaid(e.target.checked)
        setPaidSwitchIsOn(e.target.checked);
    }

    const handleOkAndCancel = () => {
        navigate(source === 'customer-bookings' ? `/Customer/${customer.id}/Bookings` : '/Bookings');
    }

    const handleShowSuccess = () => setOpenSuccess(true);
    const handleCloseSuccess = () => setOpenSuccess(false);

    const handleShowFailedAddEdit = () => setAddEditFailed(true);
    const handleHideFailedAddEdit = () => setAddEditFailed(false);

    return (
        <>
            <CustomNavbar currentPage={'Booking Information'} />
            <div className='booking-add-edit-container'>
                <div className="booking-add-edit-form">
                    <CustomAutocomplete fill={'Customers'} value={customer} onChange={(event, newValue) => setCustomer(newValue)} disabled={isEdit ? true : false} error={customerError} />
                    <CustomAutocomplete fill={'Skips'} value={skip} onChange={(event, newValue) => setSkip(newValue)} error={skipError} />
                    <CustomDatePicker label={'Hire Date'} value={hireDate} onChange={setHireDate} />
                    <CustomTextField label={'Address'} variant={'outlined'} margin={'normal'} required={true} multiline={true} rows={4} width={'440px'} value={address || ''} onChange={e => setAddress(e.target.value)} error={addressError} />
                    <CustomTextField label={'Notes'} variant={'outlined'} margin={'normal'} required={false} multiline={true} rows={4} width={'440px'} value={notes || ''} onChange={e => setNotes(e.target.value)} />
                    <div className="booking-add-edit-switches">
                        <FormControlLabel
                            control={
                                <Switch
                                    disabled={isReturned && !returnedSwitchIsOn}
                                    checked={returnedSwitchIsOn}
                                    onChange={(e) => handleReturnSwitchChange(e)}
                                />
                            }
                            label="Returned"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    disabled={isPaid && !paidSwitchIsOn}
                                    checked={paidSwitchIsOn}
                                    onChange={(e) => handlePaidSwitchChange(e)}
                                />
                            }
                            label="Paid"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isCancelled}
                                    onChange={(e) => setIsCancelled(e.target.checked)}
                                />
                            }
                            label="Cancelled"
                        />
                    </div>
                    <div className="booking-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"Cancel"} width={"200px"} height={"50px"} margin={'20px 10px 0 0'} onClick={handleOkAndCancel} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Submit"} width={"200px"} height={"50px"} margin={'20px 0 0 10px'} onClick={handleSubmitBooking} />
                    </div>
                </div>
            </div>
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