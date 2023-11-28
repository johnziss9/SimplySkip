import React, { useEffect, useState } from "react";
import './SkipAddEdit.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Dialog, DialogActions, DialogTitle, IconButton, Snackbar } from "@mui/material";

function SkipAddEdit() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [notes, setNotes] = useState('');
    const [rented, setRented] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const [isEdit, setIsEdit] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
    const [addEditFailed, setAddEditFailed] = useState(false);
    const [error, setError] = useState('');

    const [nameError, setNameError] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    useEffect(() => {
        if (id) {
            handleFetchSkip();

            setIsEdit(true);
        }
    }, [id]);

    const handleFetchSkip = async () => {
        const response = await fetch(`https://localhost:7197/skip/${id}`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const skip = await response.json();

            setName(skip.name);
            setSize(skip.skipSize);
            setNotes(skip.notes);
            setRented(skip.rented);
            setDeleted(skip.deleted);
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleSubmitSkip = async () => {
        if (isEdit) {
            const response = await fetch(`https://localhost:7197/skip/${id}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    name: name,
                    skipSize: size,
                    notes: notes,
                    rented: rented,
                    deleted: deleted
                })
            });

            if (response.ok) {
                handleCloseAddEditDialog()
                handleShowSuccess();
            } else {
                const data = await response.json();

                const { title } = data;

                setError(title);
                
                handleShowFailedAddEdit();
            }
        } else {
            const response = await fetch('https://localhost:7197/skip', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    name: name,
                    skipSize: size,
                    notes: notes,
                    rented: false,
                    deleted: false
                })
            });

            if (response.ok) {
                handleCloseAddEditDialog()
                handleShowSuccess();
            } else {
                const data = await response.json();

                if (!name || !size) {
                    setError('Please fill in required fields.')
                    setNameError(true);
                    setSizeError(true);
                } else {
                    const { title } = data;

                    setError(title);
                }

                handleShowFailedAddEdit();
            }
        }
    }

    const handleOkAndCancel = () => {
        navigate('/Skips');
    };

    const handleShowAddEditDialog = () => setOpenAddEditDialog(true);
    const handleCloseAddEditDialog = () => setOpenAddEditDialog(false);

    const handleShowSuccess = () => setOpenSuccess(true);
    const handleCloseSuccess = () => setOpenSuccess(false);

    const handleShowFailedAddEdit = () => setAddEditFailed(true);
    const handleHideFailedAddEdit = () => setAddEditFailed(false);

    return (
        <>
            <CustomNavbar currentPage={'Skip Information'} />
            <div className='skip-add-edit-container'>
                <div className="skip-add-edit-form">
                    <CustomTextField label={'Skip Name'} variant={'outlined'} required={true} margin={'normal'} width={'440px'} onChange={e => setName(e.target.value)} value={name} disabled={isEdit ? true : false} error={nameError} />
                    <CustomSelect value={size} onChange={e => setSize(e.target.value)} disabled={isEdit ? true : false} error={sizeError} />
                    <CustomTextField label={'Notes'} variant={'outlined'} margin={'normal'} required={false} multiline={true} rows={4} width={'440px'} value={notes || ''} onChange={e => setNotes(e.target.value)} />
                    <div className="skip-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"Cancel"} width={"200px"} height={"50px"} margin={'20px 10px 0 0'} onClick={handleOkAndCancel} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Submit"} width={"200px"} height={"50px"} margin={'20px 0 0 10px'} onClick={handleShowAddEditDialog} />
                    </div>
                </div>
            </div>
            <Dialog open={openAddEditDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseAddEditDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    {isEdit ? 'Make Changes to Skip?' : 'Add Booking?'}
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"No"} width={"100px"} height={"45px"} onClick={handleCloseAddEditDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Yes"} width={"100px"} height={"45px"} onClick={handleSubmitSkip} />
                </DialogActions>
            </Dialog>
            <Dialog open={openSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    {isEdit ? "Skip Edited." : "Skip Added."}
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
    );
}

export default SkipAddEdit;