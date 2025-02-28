import { Autocomplete, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomSnackbar from "../CustomSnackbar/CustomSnackbar";
import handleHttpRequest from "../../api/api";
import CustomButton from "../CustomButton/CustomButton";

function CustomAutocomplete(props) {

    const [customers, setCustomers] = useState([]);
    const [skips, setSkips] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [selectedAddressForModal, setSelectedAddressForModal] = useState(null);

    useEffect(() => {
        if (props.fill === 'Customers') {
            handleFetchCustomers();
        } else if (props.fill === 'Skips') {
            handleFetchSkips();
        }
        // eslint-disable-next-line
    }, [props.fill]);

    useEffect(() => {
        if (props.fill === 'Addresses' && props.customerId) {
            handleFetchAddressesByCustomerId(props.customerId);
        }
    }, [props.customerId, props.fill]);

    const handleFetchCustomers = async () => {
        const url = '/customer/';
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            setCustomers(data);
        } else {
            setSnackbarMessage('Failed to load customers');
            setShowSnackbar(true);
        }
    };

    const handleFetchSkips = async () => {
        const url = '/skip/available/';
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {            
            const sortedSkips = [...data].sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            
            setSkips(sortedSkips);
        } else {
            setSnackbarMessage('Failed to load skips.');
            setShowSnackbar(true);
        }
    };

    const handleFetchAddressesByCustomerId = async (customerId) => {
        try {
            if (!customerId) {
                return;
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
                // Sort addresses alphabetically by address
                const sortedAddresses = [...(response.data || [])].sort((a, b) => {
                    return a.address.localeCompare(b.address);
                });

                // Add the New Address option to the beginning of the array
                const addressesWithNewOption = [
                    newAddressOption,
                    ...sortedAddresses
                ];
                setAddresses(addressesWithNewOption);
            } else {
                // Even if the request fails, still provide the New Address option
                setAddresses([newAddressOption]);
                setSnackbarMessage('Failed to load addresses');
                setShowSnackbar(true);
            }
        } catch (error) {
            // Even if there's an error, still provide the New Address option
            setAddresses([{ address: "Νέα διεύθυνση", count: 0, isNewAddressOption: true }]);
            setSnackbarMessage(`Error loading addresses: ${error.message}`);
            setShowSnackbar(true);
        }
    };

    const formatCustomerLabel = (customer) => {
        const removeDiacritics = (text) => {
            return text ? text.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
        };

        if (customer) {
            const formattedLastName = removeDiacritics(customer.lastName?.toUpperCase());
            return `${formattedLastName}, ${customer.firstName}`;
        }
        return '';
    };

    const formatSkipLabel = (skip) => {
        if (skip) {
            return `Skip ${skip.name} - ${skip.size === 1 ? 'Μικρὀ' : 'Μεγἀλο'}`;
        }
        return '';
    };

    const formatAddressLabel = (addressItem) => {
        if (!addressItem) return '';
        
        if (addressItem.isNewAddressOption) {
            return addressItem.address; // Just return "Νέα διεύθυνση" without count
        }
        
        if (addressItem.isCustom) {
            return addressItem.address; // For custom addresses added by user
        }
        
        return `${addressItem.address} (${addressItem.count})`;
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage('');
    };

    const getOptions = () => {
        if (props.fill === 'Customers') return customers;
        if (props.fill === 'Skips') return skips;
        if (props.fill === 'Addresses') return addresses;
        return [];
    };

    const getOptionLabelFunction = () => {
        if (props.fill === 'Customers') return formatCustomerLabel;
        if (props.fill === 'Skips') return formatSkipLabel;
        if (props.fill === 'Addresses') return formatAddressLabel;
        return (option) => '';
    };

    const getLabel = () => {
        if (props.fill === 'Customers') return "Πελἀτης";
        if (props.fill === 'Skips') return "Skip";
        if (props.fill === 'Addresses') return "Διεύθυνση";
        // Throw an error for unexpected fill types
        throw new Error(`Unexpected fill type: ${props.fill}`);
    };

    // Ensures the correct option is highlighted or selected when the user interacts with the Autocomplete component
    const isOptionEqualToValue = (option, value) => {
        if (!option || !value) return false;
        
        if (props.fill === 'Addresses') {
            // For New Address option
            if (option.isNewAddressOption && value.isNewAddressOption) return true;
            
            // For custom addresses
            if ((option.isCustom || value.isCustom)) {
                return option.address === value.address;
            }
            
            // For regular addresses from the API
            return option.address === value.address;
        }
        
        // For customers and skips, compare by id
        return option.id === value.id;
    };

    const handleShowAddressModal = (addressItem) => {
        setSelectedAddressForModal(addressItem);
        setOpenAddressModal(true);
    };

    const handleCloseAddressModal = () => {
        setOpenAddressModal(false);
        setSelectedAddressForModal(null);
    };

    return (
        <>
            <Autocomplete
                disablePortal
                options={getOptions()}
                getOptionLabel={getOptionLabelFunction()}
                isOptionEqualToValue={isOptionEqualToValue}
                sx={{ width: props.width }}
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled}
                noOptionsText="Δεν υπάρχουν διαθέσιμες επιλογές"
                renderInput={(params) => (
                    <TextField
                        margin="normal"
                        {...params}
                        required={props.required !== false}
                        label={getLabel()}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#006d77', // Changes border style when not focused
                                    borderRadius: 0,
                                },
                                '&:hover fieldset': {
                                    border: '2px solid #006d77', // Changes border style on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#006d77 !important', // Changes border style when focused
                                }
                            },
                            '& input': {
                                color: '#006d77', // Changes the font color
                            }
                        }}
                        InputLabelProps={{
                            style: {
                                color: '#006d77', // Changes the label color
                            },
                        }}
                        // Adds view icon for selected address
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {params.InputProps.endAdornment}
                                    {props.fill === 'Addresses' && props.value && (
                                        <InputAdornment position="end">
                                            <VisibilityIcon 
                                                sx={{ 
                                                    color: '#006d77', 
                                                    marginRight: '10px', 
                                                    cursor: 'pointer' 
                                                }} 
                                                onClick={() => handleShowAddressModal(props.value)}
                                            />
                                        </InputAdornment>
                                    )}
                                </>
                            ),
                        }}
                        error={props.error}
                    />
                )}
            />
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity="error" />
            
            {/* Address Details Modal */}
            <Dialog
                open={openAddressModal}
                onClose={handleCloseAddressModal}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1 }}>
                    Πληροφορίες Διεύθυνσης
                </DialogTitle>
                <DialogContent sx={{ 
                    pt: 1, 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    pb: 3
                }}>
                    {selectedAddressForModal && (
                        <>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    width: '100%', 
                                    textAlign: 'center',
                                    color: '#006d77',
                                    fontWeight: 'bold',
                                    marginTop: '10px'
                                }}
                            >
                                {selectedAddressForModal.isNewAddressOption 
                                    ? "Νέα διεύθυνση" 
                                    : selectedAddressForModal.address}
                            </Typography>
                            {!selectedAddressForModal.isNewAddressOption && selectedAddressForModal.count > 0 && (
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        width: '100%', 
                                        textAlign: 'center',
                                        color: '#006d77'
                                    }}
                                >
                                    {`Σύνολο Κρατήσεων: ${selectedAddressForModal.count}`}
                                </Typography>
                            )}
                        </>
                    )}
                    <CustomButton 
                        backgroundColor={"#006d77"} 
                        buttonName={"OK"} 
                        width={"200px"} 
                        height={"45px"} 
                        onClick={handleCloseAddressModal} 
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CustomAutocomplete;