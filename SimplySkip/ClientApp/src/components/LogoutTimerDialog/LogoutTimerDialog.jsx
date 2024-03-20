import React from 'react';
import CustomButton from '../CustomButton/CustomButton';
import { Dialog, DialogTitle, DialogActions } from '@mui/material';

const TimerDialog = ({ open, onClose, onYesClick }) => {
    return (
        <Dialog open={open} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { onClose(event, reason) } }}>
            <DialogTitle sx={{ width: '400px' }}>Session Expiring. Continue?</DialogTitle>
            <DialogActions>
                <CustomButton backgroundColor={"#006d77"} buttonName={"Ὀχι"} width={"100px"} height={"45px"} onClick={onClose} />
                <CustomButton backgroundColor={"#006d77"} buttonName={"Ναι"} width={"100px"} height={"45px"} onClick={onYesClick} />
            </DialogActions>
        </Dialog>
    );
};

export default TimerDialog;
