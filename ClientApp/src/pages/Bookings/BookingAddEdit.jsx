import React, { useEffect, useState } from "react";
import './BookingAddEdit.css';
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomAutocomplete from "../../components/CustomAutocomplete/CustomAutocomplete";
import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker";
import { Dialog, DialogActions, DialogTitle, FormControlLabel, Switch } from "@mui/material";

function BookingAddEdit() {

    const { id } = useParams();

    const [isEdit, setIsEdit] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);

    const [customer, setCustomer] = useState(null);
    const [skip, setSkip] = useState(null); // TODO Use this for skip once fetched
    const [hireDate, setHireDate] = useState(new Date());
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [isReturned, setIsReturned] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);

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
            // TODO Fetch Skip
            setHireDate(new Date(booking.hireDate));
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

    const handleSubmitBooking = async () => {
        if (isEdit) {
            const response = await fetch(`https://localhost:7197/booking/${id}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    // TODO Change skip id from dropdown
                    hireDate: hireDate,
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
                // TODO Handle error
            }
        } else {
            const response = await fetch('https://localhost:7197/booking', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    customerId: customer.id,
                    // TODO Change skip id from dropdown
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
                // TODO Handle error
            }
        }
    }

    const handleShowSuccess = () => setOpenSuccess(true);
    const handleCloseSuccess = () => setOpenSuccess(false);

    return (
        <>
            <CustomNavbar currentPage={'Booking Information'} />
            <div className='booking-add-edit-container'>
                <div className="booking-add-edit-form">
                    <CustomAutocomplete fill={'Customers'} value={customer} onChange={(event, newValue) => setCustomer(newValue)} disabled={isEdit ? true : false} />
                    <CustomAutocomplete fill={'Skips'} />
                    <CustomDatePicker label={'Hire Date'} value={hireDate} onChange={setHireDate} />
                    <CustomTextField label={'Address'} variant={'outlined'} margin={'normal'} required={true} multiline={true} rows={4} width={'440px'} value={address || ''} onChange={e => setAddress(e.target.value)} />
                    <CustomTextField label={'Notes'} variant={'outlined'} margin={'normal'} required={false} multiline={true} rows={4} width={'440px'} value={notes || ''} onChange={e => setNotes(e.target.value)} />
                    <div className="booking-add-edit-switches">
                        <FormControlLabel
                            control={
                                <Switch
                                disabled={isReturned ? true : false}
                                checked={isReturned}
                                onChange={setIsReturned}
                                />
                            }
                            label="Returned"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                disabled={isPaid ? true : false}
                                checked={isPaid}
                                onChange={setIsPaid}
                                />
                            }
                            label="Paid"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                checked={isCancelled}
                                onChange={setIsCancelled}
                                />
                            }
                            label="Cancelled"
                        />
                    </div>
                    <div className="booking-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"Cancel"} width={"200px"} height={"50px"} margin={'20px 10px 0 0'} onClick={handleShowSuccess} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Submit"} width={"200px"} height={"50px"} margin={'20px 0 0 10px'} onClick={handleSubmitBooking} />
                    </div>
                </div>
            </div>
            <Dialog open={openSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    {isEdit ? "Booking Edited." : "Booking Added."}
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseSuccess(event, reason) } }} />
                </DialogActions>
            </Dialog>
        </>
    )
}

export default BookingAddEdit;