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
    const [openSuccess, setOpenSuccess] = useState(false);
    // const [isReturned, setIsReturned] = useState(false);
    // const [isPaid, setIsPaid] = useState(false);
    // const [isCancelled, setIsCancelled] = useState(false);

    // const handlePaidToggle = () => {
    //     setIsPaid((prevIsPaid) => !prevIsPaid);
    // };

    // const handleShowSuccess = () => setOpenSuccess(true);
    // const handleCloseSuccess = () => setOpenSuccess(false);

    return (
        <>
            <CustomNavbar currentPage={'Booking Information'} />
            <div className='booking-add-edit-container'>
                <div className="booking-add-edit-form">
                    <CustomAutocomplete fill={'Customers'} />
                    <CustomAutocomplete fill={'Skips'} />
                    <CustomDatePicker />
                    <CustomTextField label={'Address'} variant={'outlined'} margin={'normal'} required={true} multiline={true} rows={4} width={'440px'} />
                    <CustomTextField label={'Notes'} variant={'outlined'} margin={'normal'} required={true} multiline={true} rows={4} width={'440px'} />
                    <div className="booking-add-edit-switches">
                        <FormControlLabel
                            control={
                                <Switch
                                    // disabled={false}
                                    // checked={isPaid}
                                    // onChange={() => console.log('paid')}
                                />
                            }
                            label="Returned"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    // disabled={false}
                                    // checked={isPaid}
                                    // onChange={() => console.log('paid')}
                                />
                            }
                            label="Paid"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    // disabled={false}
                                    // checked={isPaid}
                                    // onChange={() => console.log('paid')}
                                />
                            }
                            label="Cancelled"
                        />
                    </div>
                    <div className="booking-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"Cancel"} width={"200px"} height={"50px"} margin={'20px 10px 0 0'} onClick={handleOkAndCancel} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Submit"} width={"200px"} height={"50px"} margin={'20px 0 0 10px'} onClick={handleSubmitCustomer} />
                    </div>
                </div>
            </div>
            {/* <Dialog open={openSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    {isEdit ? "Booking Edited." : "Booking Added."}
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleOkAndCancel} />
                </DialogActions>
            </Dialog> */}
        </>
    )
}

export default BookingAddEdit;