import React, { useEffect, useState } from "react";
import './SkipAddEdit.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogActions, DialogTitle, useMediaQuery } from "@mui/material";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";

function SkipAddEdit() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [notes, setNotes] = useState('');
    const [rented, setRented] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [createdOn, setCreatedOn] = useState(new Date());
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [deletedOn, setDeletedOn] = useState(new Date());

    const [isEdit, setIsEdit] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [nameError, setNameError] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    const fieldsWidth = useMediaQuery('(max-width: 550px)');

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
            setSize(skip.size);
            setNotes(skip.notes.replace(/, /g, '\n'));
            setRented(skip.rented);
            setDeleted(skip.deleted);
            setCreatedOn(new Date(new Date(skip.createdOn)));
            setLastUpdated(new Date(new Date(skip.lastUpdated)));
            setDeletedOn(new Date(new Date(skip.deletedOn)));
        } else {
            setSnackbarMessage('Failed to load skip.');
            setShowSnackbar(true);
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
                    size: size,
                    notes: notes.replace(/\n/g, ', '),
                    rented: rented,
                    deleted: deleted,
                    createdOn: createdOn,
                    lastUpdated: new Date(new Date()),
                    deletedOn: deletedOn
                })
            });

            if (response.ok) {
                handleCloseAddEditDialog()
                handleShowSuccess();
            } else {
                setSnackbarMessage('Failed to add booking.');
                setShowSnackbar(true);
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
                    size: size,
                    notes: notes.replace(/\n/g, ', '),
                    rented: false,
                    deleted: false,
                    createdOn: new Date(new Date()),
                    lastUpdated: new Date(new Date()),
                    deletedOn: new Date(new Date())
                })
            });

            if (response.ok) {
                handleCloseAddEditDialog()
                handleShowSuccess();
            } else {
                if (!name || !size) {
                    setSnackbarMessage('Please fill in required fields.')
                    setNameError(true);
                    setSizeError(true);
                } else {
                    setSnackbarMessage('Failed to add booking.');
                }

                setShowSnackbar(true);
            }
        }
    }

    const handleOkAndCancel = () => {
        navigate('/Skips');
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
            <CustomNavbar currentPage={'Skip Information'} />
            <div className='skip-add-edit-container'>
                <div className="skip-add-edit-form">
                    <CustomTextField label={'Skip Name'} variant={'outlined'} required={true} margin={'normal'} width={fieldsWidth ? '300px' : '440px'} onChange={e => setName(e.target.value)} value={name} disabled={isEdit ? true : false} error={nameError} />
                    <CustomSelect value={size} onChange={e => setSize(e.target.value)} disabled={isEdit ? true : false} error={sizeError} width={fieldsWidth ? '300px' : '440px'} />
                    <CustomTextField label={'Notes'} variant={'outlined'} margin={'normal'} required={false} multiline={true} rows={4} width={fieldsWidth ? '300px' : '440px'} value={notes || ''} onChange={e => setNotes(e.target.value)} />
                    <div className="skip-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"Cancel"} width={"200px"} height={"50px"} margin={fieldsWidth ? '20px 0' : '20px 10px 0 0'} onClick={handleOkAndCancel} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Submit"} width={"200px"} height={"50px"} margin={fieldsWidth ? '0 0 20px 0' : '20px 0 0 10px'} onClick={handleShowAddEditDialog} />
                    </div>
                </div>
            </div>
            <Dialog open={openAddEditDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseAddEditDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    {isEdit ? 'Make Changes to Skip?' : 'Add Skip?'}
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
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity="error" />
        </>
    );
}

export default SkipAddEdit;