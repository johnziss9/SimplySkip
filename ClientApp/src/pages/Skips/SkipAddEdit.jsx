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

    const baseUrl = process.env.REACT_APP_URL;

    useEffect(() => {
        if (id) {
            handleFetchSkip();

            setIsEdit(true);
        }
    }, [id]);

    const handleFetchSkip = async () => {
        const url = `/skip/${id}`;
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            setName(data.name);
            setSize(data.size);
            setNotes(data.notes.replace(/, /g, '\n'));
            setRented(data.rented);
            setDeleted(data.deleted);
            setCreatedOn(new Date(new Date(data.createdOn)));
            setLastUpdated(new Date(new Date(data.lastUpdated)));
            setDeletedOn(new Date(new Date(data.deletedOn)));
        } else {
            setSnackbarMessage('Failed to load skip.');
            setShowSnackbar(true);
        }
    };

    const handleSubmitSkip = async () => {
        if (isEdit) {
            const url = `/skip/${id}`;
            const method = 'PUT';
            const body = {
                name: name,
                size: size,
                notes: notes.replace(/\n/g, ', '),
                rented: rented,
                deleted: deleted,
                createdOn: createdOn,
                lastUpdated: new Date(new Date()),
                deletedOn: deletedOn
            };

            const { success } = await handleHttpRequest(url, method, body);

            if (success) {            
                handleCloseAddEditDialog()
                handleShowSuccess();
            } else {
                setSnackbarMessage('Failed to add booking.');
                setShowSnackbar(true);
            }
        } else {
            const url = '/skip/';
            const method = 'POST';
            const body = {
                name: name,
                size: size,
                notes: notes.replace(/\n/g, ', '),
                rented: false,
                deleted: false,
                createdOn: new Date(new Date()),
                lastUpdated: new Date(new Date()),
                deletedOn: new Date(new Date())
            };

            const { success } = await handleHttpRequest(url, method, body);

            if (success) {            
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