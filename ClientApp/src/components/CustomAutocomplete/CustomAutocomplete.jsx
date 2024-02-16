import { Autocomplete, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import CustomSnackbar from "../CustomSnackbar/CustomSnackbar";

function CustomAutocomplete(props) {

    const [customers, setCustomers] = useState([]);
    const [skips, setSkips] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    useEffect(() => {
        handleFetchCustomers();
        handleFetchSkips();
        // eslint-disable-next-line
    }, []);

    const handleFetchCustomers = async () => {
        const response = await fetch("http://localhost:5000/customer/", {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const data = await response.json();

            setCustomers(data);
        } else {
            setSnackbarMessage('Failed to load customers.');
            setShowSnackbar(true);
        }
    }

    const handleFetchSkips = async () => {
        const response = await fetch("http://localhost:5000/skip/available/", {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const data = await response.json();

            setSkips(data);
        } else {
            setSnackbarMessage('Failed to load skips.');
            setShowSnackbar(true);
        }
    }

    const formatCustomerLabel = (customer) => {
        if (customer) {
            const formattedLastName = customer.lastName.toUpperCase();
            return `${formattedLastName}, ${customer.firstName}`;
        }
        return '';
    };

    const formatSkipLabel = (skip) => {
        if (skip) {
            return `Skip ${skip.name} - ${skip.size == 1 ? 'Small' : 'Large'}`;
        }
        return '';
    };

    const handleCloseSnackbar = () => {
        setSnackbarMessage(false);
        setShowSnackbar('');
    };

    return (
        <>
            <Autocomplete
                disablePortal
                options={props.fill == 'Customers' ? customers : skips}
                getOptionLabel={props.fill == 'Customers' ? formatCustomerLabel : formatSkipLabel}
                sx={{ width: props.width }}
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled}
                renderInput={(params) => (
                    <TextField
                        margin="normal"
                        {...params}
                        required
                        label={props.fill == 'Customers' ? "Customer" : "Skip"}
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
                        error={props.error}
                    />
                )}
            />
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity="error" />
        </>
    );
}

export default CustomAutocomplete;