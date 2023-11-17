import { Autocomplete, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";

function CustomAutocomplete(props) {

    const [customers, setCustomers] = useState([]);
    const [skips, setSkips] = useState([]);

    useEffect(() => {
        handleFetchCustomers();
        // eslint-disable-next-line
    }, []);

    const handleFetchCustomers = async () => {
        const response = await fetch("https://localhost:7197/customer/", {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const data = await response.json();

            setCustomers(data);
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleFetchSkips = async () => {
        // TODO Fetch Skips
    }

    const formatCustomerLabel = (customer) => {
        const formattedLastName = customer.lastName.toUpperCase();
        return `${formattedLastName}, ${customer.firstName}`;
    };

    return (
        <Autocomplete
            disablePortal
            options={props.fill == 'Customers' ? customers : skips}
            getOptionLabel={formatCustomerLabel}
            sx={{ width: '440px' }}
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
            renderInput={(params) => (
                <TextField
                    margin="normal"
                    {...params}
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
                />
            )}
        />
    );
}

export default CustomAutocomplete;