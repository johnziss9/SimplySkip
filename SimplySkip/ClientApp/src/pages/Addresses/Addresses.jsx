import { useState, useEffect } from "react";
import './Addresses.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import { useNavigate, useParams } from "react-router-dom";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import handleHttpRequest from "../../api/api";
import AddressCard from "../../components/AddressCard/AddressCard";
import { Typography, CircularProgress, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomAutocomplete from "../../components/CustomAutocomplete/CustomAutocomplete";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomButton from "../../components/CustomButton/CustomButton";

function Addresses() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [addressesWithCounts, setAddressesWithCounts] = useState([]);
    const [customer, setCustomer] = useState({});
    const [totalBookings, setTotalBookings] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);

    // Edit address dialog states
    const [openEditAddressDialog, setOpenEditAddressDialog] = useState(false);
    const [selectedAddressForEdit, setSelectedAddressForEdit] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [newAddressText, setNewAddressText] = useState('');
    const [openNewAddressDialog, setOpenNewAddressDialog] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [newAddressError, setNewAddressError] = useState(false);

    useEffect(() => {
        handleFetchAddressesWithCounts();
        handleFetchCustomer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFetchAddressesWithCounts = async () => {
        try {
            setIsLoading(true);

            const url = `/booking/customer/${id}/addresses/counts`;
            const method = 'GET';

            const { success, data } = await handleHttpRequest(url, method);

            if (success) {
                calculateTotalBookings(data);
                setAddressesWithCounts(data);
            } else {
                setSnackbarMessage('Failed to load customer addresses.');
                setShowSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('An error occurred while loading customer addresses.');
            setShowSnackbar(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage('');
        setSnackbarSuccess(false)
    };

    const handleFetchCustomer = async () => {
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
            setSnackbarMessage('An error occurred while loading customer.');
            setShowSnackbar(true);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTotalBookings = (addressesData) => {
        // Iterates through the addresses data and calculates the total bookings for all addresses.
        const total = addressesData.reduce((sum, item) => sum + item.count, 0);
        setTotalBookings(total);
    };

    const navigateToAddressBookings = (address) => {
        navigate(`/Customer/${id}/Bookings`, {
            state: { filterAddress: address } // Pass the address to in order to filter bookings in CustomerBookings component.
        });
    };

    const handleBackToCustomer = () => {
        // Navigate back to the Customers page with state indicating to open the modal
        navigate('/Customers', {
            state: {
                openCustomerModal: true,
                customerId: id
            }
        });
    };

    const handleEditAddress = (currentAddress) => {
        setSelectedAddressForEdit(currentAddress);
        setSelectedAddress(null);
        setOpenEditAddressDialog(true);
    };

    const handleAddressChange = (event, newValue) => {
        setSelectedAddress(newValue);

        if (newValue && newValue.isNewAddressOption) {
            // Open the new address dialog when "New Address" option is selected
            setOpenNewAddressDialog(true);
            setNewAddressText('');
        } else if (newValue) {
            // Normal address selection
            setAddressError(false);
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

    const handleBulkUpdateAddress = async () => {
        if (!selectedAddress || selectedAddress.isNewAddressOption) {
            setAddressError(true);
            return;
        }

        try {
            const url = `/booking/customer/${id}/address/bulk-update`;
            const method = 'PUT';
            const body = {
                oldAddress: selectedAddressForEdit.replace(/\n/g, ', '),
                newAddress: selectedAddress.address.replace(/\n/g, ', ')
            };

            const { success, data } = await handleHttpRequest(url, method, body);

            if (success) {
                setSnackbarMessage(`Επιτυχής ενημέρωση ${data} κρατήσεων.`);
                setSnackbarSuccess(true);
                setShowSnackbar(true);
                handleCloseEditAddressDialog();
                
                // Refresh the addresses list
                await handleFetchAddressesWithCounts();
            } else {
                setSnackbarMessage('Αποτυχία ενημέρωσης διεύθυνσης.');
                setShowSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('Παρουσιάστηκε σφάλμα κατά την ενημέρωση της διεύθυνσης.');
            setShowSnackbar(true);
        }
    };

    const handleCloseEditAddressDialog = () => {
        setOpenEditAddressDialog(false);
        setSelectedAddressForEdit(null);
        setSelectedAddress(null);
        setAddressError(false);
    };

    return (
        <>
            <CustomNavbar currentPage={'Διευθύνσεις'} totalBookings={totalBookings} customerId={id} addNewClick="/Booking" addNewSource="addresses" />
            <div className='addresses-container'>
                <div className="addresses-header">
                    <IconButton
                        onClick={handleBackToCustomer}
                        sx={{
                            color: '#006d77',
                            marginRight: '10px',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 109, 119, 0.1)'
                            }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography
                        sx={{
                            color: '#006d77',
                            fontSize: '20px',
                            fontWeight: '500'
                        }}
                    >
                        {`${customer.firstName || ''} ${customer.lastName || ''}`}
                    </Typography>
                </div>
                <div className="addresses-section">
                    <Typography sx={{ marginBottom: '10px', color: '#006d77', width: '100%', textAlign: 'center' }}>
                        {`Σύνολο Κρατήσεων για όλες τις διευθύνσεις: ${totalBookings}`}
                    </Typography>
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', width: '100%' }}>
                            <CircularProgress size={40} sx={{ color: '#006d77' }} />
                        </div>
                    ) :
                        Array.isArray(addressesWithCounts) && addressesWithCounts.length > 0 ? addressesWithCounts
                            .sort((a, b) => a.address.localeCompare(b.address))
                            .map((item, index) => (
                                <AddressCard
                                    key={index}
                                    address={item.address}
                                    bookingCount={item.count}
                                    onClick={() => navigateToAddressBookings(item.address)}
                                    onClickEdit={() => handleEditAddress(item.address)}
                                />
                            )) : null}
                </div>
            </div>
            {/* Edit Address Dialog */}
            <Dialog
                open={openEditAddressDialog}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        handleCloseEditAddressDialog(event, reason);
                    }
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Επεξεργασία Διεύθυνσης
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 2, color: '#757575' }}>
                        Τρέχουσα διεύθυνση:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, fontWeight: 'bold' }}>
                        {selectedAddressForEdit}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: '#757575' }}>
                        Αριθμός κρατήσεων που θα ενημερωθούν: <strong>
                            {addressesWithCounts.find(a => a.address === selectedAddressForEdit)?.count || 0}
                        </strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Επιλέξτε νέα διεύθυνση:
                    </Typography>
                    {customer && customer.id && (
                        <CustomAutocomplete
                            fill={'Addresses'}
                            customerId={customer.id}
                            value={selectedAddress}
                            onChange={handleAddressChange}
                            error={addressError}
                            required={true}
                            width={'100%'}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <CustomButton 
                        backgroundColor={"#83c5be"} 
                        buttonName={"ΑΚΥΡΩΣΗ"} 
                        width={"120px"} 
                        height={"45px"} 
                        onClick={handleCloseEditAddressDialog} 
                    />
                    <CustomButton 
                        backgroundColor={"#006d77"} 
                        buttonName={"ΑΠΟΘΗΚΕΥΣΗ"} 
                        width={"120px"} 
                        height={"45px"} 
                        onClick={handleBulkUpdateAddress} 
                    />
                </DialogActions>
            </Dialog>

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
                    <CustomButton 
                        backgroundColor={"#83c5be"} 
                        buttonName={"ΑΚΥΡΩΣΗ"} 
                        width={"120px"} 
                        height={"45px"} 
                        onClick={handleCloseNewAddressDialog} 
                    />
                    <CustomButton 
                        backgroundColor={"#006d77"} 
                        buttonName={"ΑΠΟΘΗΚΕΥΣΗ"} 
                        width={"120px"} 
                        height={"45px"} 
                        onClick={handleNewAddressSubmit} 
                    />
                </DialogActions>
            </Dialog>

            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity={snackbarSuccess ? 'success' : 'error'} />
        </>
    );
}

export default Addresses;