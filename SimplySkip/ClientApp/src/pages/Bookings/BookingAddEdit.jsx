import React, { useEffect, useState } from "react";
import './BookingAddEdit.css';
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomAutocomplete from "../../components/CustomAutocomplete/CustomAutocomplete";
import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker";
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, useMediaQuery } from "@mui/material";
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
    const [openNewAddressDialog, setOpenNewAddressDialog] = useState(false);
    const [newAddressText, setNewAddressText] = useState('');

    const [customer, setCustomer] = useState(null);
    const [skip, setSkip] = useState(null);
    const [previousSkipId, setPreviousSkipId] = useState(null); // Used for handling skip status
    const [smallSkips, setSmallSkips] = useState(0);
    const [largeSkips, setLargeSkips] = useState(0);
    const [hireDate, setHireDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [address, setAddress] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null); // For the address autocomplete
    const [notes, setNotes] = useState('');
    const [isReturned, setIsReturned] = useState(false);
    const [previousIsReturned, setPreviousIsReturned] = useState(false); // Used for handling skip status
    const [isPaid, setIsPaid] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarSuccess, setSnackbarSuccess] = useState(false); // Used to change snackbar alert severity
    const [createdOn, setCreatedOn] = useState(new Date());
    const [cancelledOn, setCancelledOn] = useState(new Date());

    const [skipError, setSkipError] = useState(false);
    const [customerError, setCustomerError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [newAddressError, setNewAddressError] = useState(false);

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
        const storedCustomerId = localStorage.getItem('CustomerId');

        if (storedCustomerId != null) {
            handleFetchCustomer(storedCustomerId);
            localStorage.clear();
        }

        handleFetchAvailableSkips();
        // eslint-disable-next-line
    }, [id]);

    useEffect(() => {
        if (selectedAddress && !selectedAddress.isNewAddressOption) {
            setAddress(selectedAddress.address.replace(/, /g, '\n'));
            setAddressError(false);
        }
    }, [selectedAddress]);

    // Fetches addresses for the selected customer
    // Converts the current address from multi-line to comma-separated format
    // Tries to match the address with existing addresses in the system
    useEffect(() => {
        if (customer && customer.id && address && !selectedAddress) {
            // Fetch addresses if needed
            handleFetchAddressesByCustomerId(customer.id)
                .then(addresses => {
                    if (addresses && addresses.length > 0) {
                        const cleanAddress = address.replace(/\n/g, ', ');

                        // Find existing address or create custom one
                        const matchingAddress = addresses.find(
                            addr => addr.address === cleanAddress && !addr.isNewAddressOption
                        );

                        if (matchingAddress) {
                            setSelectedAddress(matchingAddress);
                        } else if (cleanAddress) {
                            setSelectedAddress({
                                address: cleanAddress,
                                count: 0,
                                isCustom: true
                            });
                        }
                    }
                });
        }
    }, [customer, address]);

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
        try {
            const url = `/customer/${id}`;
            const method = 'GET';

            const { success, data } = await handleHttpRequest(url, method);

            if (success) {
                setCustomer(data);
            } else {
                setSnackbarMessage('Failed to load customer.');
                setShowSnackbar(true);
            }
        } catch (error) {
            console.error("Error fetching customer:", error);
            setSnackbarMessage('Error loading customer data.');
            setShowSnackbar(true);
        }
    };

    const handleCustomerChange = (event, newValue) => {
        setCustomer(newValue);

        // Reset selected address when customer changes
        setSelectedAddress(null);

        setAddress('');
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

    const handleFetchAddressesByCustomerId = async (customerId) => {
        try {
            if (!customerId) {
                console.error("No customerId provided to handleFetchAddressesByCustomerId");
                return [];
            }

            const url = `/booking/customer/${customerId}/addresses/counts`;
            const method = 'GET';

            const response = await handleHttpRequest(url, method);

            // Create the "New Address" option
            const newAddressOption = {
                address: "Νέα διεύθυνση",
                count: 0,
                isNewAddressOption: true
            };

            if (response && response.success) {
                // Add the New Address option to the beginning of the array
                const addressesWithNewOption = [
                    newAddressOption,
                    ...(response.data || [])
                ];
                return addressesWithNewOption;
            } else {
                // Even if the request fails, still provide the New Address option
                return [newAddressOption];
            }
        } catch (error) {
            // Even if there's an error, still provide the New Address option
            return [{ address: "Νέα διεύθυνση", count: 0, isNewAddressOption: true }];
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
                    setSkipError(!skip);
                    setAddressError(!address);
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
                    setSkipError(!skip);
                    setCustomerError(!customer);
                    setAddressError(!address);
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

    const handleOkAndCancel = () => {
        const addNewSource = sessionStorage.getItem('AddNewSource');
        const filterAddress = sessionStorage.getItem('FilterAddress');
        
        // source - when editing a booking from the customer bookings
        // addNewSource - when creating a booking in customer bookings?
        if (source === 'customer-bookings' || addNewSource === 'customer-bookings') {
            navigate(`/Customer/${customer.id}/Bookings`, { 
                state: { filterAddress: filterAddress } 
            });
        } else if (addNewSource === 'addresses') {
            navigate(`/Addresses/${customer.id}`);
        } else {
            navigate('/Bookings');
        }
        
        // Clean up session storage
        sessionStorage.removeItem('AddNewSource');
        sessionStorage.removeItem('FilterAddress');
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

    const handleAddressChange = (event, newValue) => {
        setSelectedAddress(newValue);

        if (newValue && newValue.isNewAddressOption) {
            // Open the new address dialog when "New Address" option is selected
            setOpenNewAddressDialog(true);
            setNewAddressText('');
        } else if (newValue) {
            // Normal address selection
            setAddress(newValue.address.replace(/, /g, '\n'));
            setAddressError(false);
        } else {
            // If selection is cleared, clear address as well
            setAddress('');
        }
    };

    const handleNewAddressSubmit = () => {
        if (!newAddressText.trim()) {
            setNewAddressError(true);
            return;
        }

        // Create a new custom address option
        const newCustomAddress = {
            address: newAddressText.trim(),
            count: 0,
            isCustom: true
        };

        // Set the address in the text field
        setAddress(newAddressText.trim());
        setAddressError(false);

        // Set this as the selected address in the dropdown
        setSelectedAddress(newCustomAddress);

        // Close the dialog
        setOpenNewAddressDialog(false);
        setNewAddressText('');
        setNewAddressError(false);
    };

    const handleCloseNewAddressDialog = () => {
        setOpenNewAddressDialog(false);
        setNewAddressText('');
        setNewAddressError(false);

        // If we're closing without saving, reset the selected address
        if (selectedAddress && selectedAddress.isNewAddressOption) {
            setSelectedAddress(null);
        }
    };

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
                    <CustomAutocomplete
                        fill={'Customers'}
                        value={customer}
                        onChange={handleCustomerChange}
                        disabled={isEdit ? true : false}
                        error={customerError}
                        width={fieldsWidth ? '300px' : '440px'}
                    />
                    <CustomAutocomplete
                        fill={'Skips'}
                        value={skip}
                        onChange={(event, newValue) => setSkip(newValue)}
                        disabled={isEdit && (!isCancelled && !isPaid && !isReturned) && (hireDate < new Date()) ? true : false}
                        error={skipError}
                        width={fieldsWidth ? '300px' : '440px'}
                    />
                    <CustomDatePicker
                        label={'Ημερομηνία Κρἀτησης'}
                        value={hireDate}
                        disabled={isEdit && (!isCancelled && !isPaid && !isReturned) && hireDate < new Date()}
                        minDate={isEdit && (!isCancelled && !isPaid && !isReturned) && hireDate > new Date() ? setMinDate : null}
                        onChange={setHireDate}
                        width={fieldsWidth ? '300px' : '440px'}
                    />

                    {customer && customer.id && (
                        <CustomAutocomplete
                            fill={'Addresses'}
                            customerId={customer.id}
                            value={selectedAddress}
                            onChange={handleAddressChange}
                            disabled={(isEdit && (!isCancelled && !isPaid && !isReturned) && (hireDate < new Date()))}
                            error={addressError}
                            required={true}
                            width={fieldsWidth ? '300px' : '440px'}
                        />
                    )}

                    <CustomTextField
                        label={'Σημειώσεις'}
                        variant={'outlined'}
                        margin={'normal'}
                        required={false}
                        multiline={true}
                        rows={4}
                        width={fieldsWidth ? '300px' : '440px'}
                        value={notes || ''}
                        onChange={e => setNotes(e.target.value)}
                    />

                    <div className="booking-add-edit-switches">
                        <CustomSwitch
                            disabled={(isReturned && !returnedSwitchIsOn) || !isEdit}
                            checked={returnedSwitchIsOn || isReturned}
                            onChange={(e) => handleReturnSwitchChange(e)}
                            label="Επιστράφηκε"
                        />
                        <CustomSwitch
                            disabled={(isPaid && !paidSwitchIsOn)}
                            checked={paidSwitchIsOn || isPaid}
                            onChange={(e) => handlePaidSwitchChange(e)}
                            label="Πληρώθηκε"
                        />
                        <CustomSwitch
                            disabled={!isEdit || hireDate <= new Date()}
                            checked={isCancelled || isCancelled}
                            onChange={(e) => setIsCancelled(e.target.checked)}
                            label="Ακυρώθηκε"
                        />
                    </div>

                    <div className="booking-add-edit-form-buttons">
                        <CustomButton
                            backgroundColor={"#83c5be"}
                            buttonName={"ΑΚΥΡΩΣΗ"}
                            width={"200px"}
                            height={"50px"}
                            margin={fieldsWidth ? '20px 0' : '20px 10px 0 0'}
                            onClick={handleOkAndCancel}
                        />
                        <CustomButton
                            backgroundColor={"#006d77"}
                            buttonName={"ΑΠΟΘΗΚΕΥΣΗ"}
                            width={"200px"}
                            height={"50px"}
                            margin={fieldsWidth ? '0 0 20px 0' : '20px 0 0 10px'}
                            onClick={handleShowAddEditDialog}
                        />
                    </div>
                </div>
            </div>

            {/* New Address Dialog */}
            <Dialog
                open={openNewAddressDialog}
                onClose={handleCloseNewAddressDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1 }}>
                    Νέα διεύθυνση
                </DialogTitle>
                <DialogContent sx={{ 
                    pt: 1, 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column' 
                }}>
                    <CustomTextField
                        label={'Εισαγάγετε νέα διεύθυνση'}
                        variant={'outlined'}
                        margin={'normal'}
                        required={true}
                        multiline={true}
                        rows={5}
                        fullWidth
                        value={newAddressText}
                        onChange={(e) => {
                            setNewAddressText(e.target.value);
                            if (e.target.value) setNewAddressError(false);
                        }}
                        error={newAddressError}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <CustomButton backgroundColor={"#83c5be"} buttonName={"ΑΚΥΡΩΣΗ"} width={"120px"} height={"45px"} onClick={handleCloseNewAddressDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"ΑΠΟΘΗΚΕΥΣΗ"} width={"120px"} height={"45px"} onClick={handleNewAddressSubmit} />
                </DialogActions>
            </Dialog>

            {/* Confirm Save Dialog */}
            <Dialog
                open={openAddEditDialog}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        handleCloseAddEditDialog(event, reason)
                    }
                }}
            >
                <DialogTitle sx={{ width: '400px' }}>
                    {isEdit ? 'Αποθήκευση αλλαγών στην κράτηση;' : 'Αποθήκευση κρἀτησης;'}
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"No"} width={"100px"} height={"45px"} onClick={handleCloseAddEditDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Yes"} width={"100px"} height={"45px"} onClick={handleSubmitBooking} />
                </DialogActions>
            </Dialog>

            {/* Success Dialog */}
            <Dialog
                open={openSuccess}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        handleCloseSuccess(event, reason)
                    }
                }}
            >
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