import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function CustomSelect(props) {
    return (
        <FormControl margin="normal" sx={{ width: '440px' }}>
            <InputLabel
                required
                error={props.error}
                sx={{
                    color: '#006d77',
                    '&.Mui-focused': {
                        color: '#006d77'
                    },
                    '&.Mui-error': {
                        color: '#006d77',  // Reset the color for the entire label when it has an error
                    },
                    '& .MuiFormLabel-asterisk': {
                        color: props.error ? '#d32f2f' : 'inherit',  // Change the color of the asterisk
                    },

                }}>Size</InputLabel>
            <Select
                value={props.value}
                label="Size"
                disabled={props.disabled}
                onChange={props.onChange}
                labelStyle={{ color: '#006d77' }}
                error={props.error}
                sx={{
                    color: "#006d77",
                    '.MuiOutlinedInput-notchedOutline': { // Changed border off focus
                        border: '1px solid #006d77',
                        borderRadius: '0'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { // Changed border on focus
                        borderColor: '#006d77'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': { // Changed border on hover
                        border: '2px solid #006d77',
                    },
                    '.MuiSvgIcon-root ': { // Changed icon colour
                        fill: "#006d77 !important",
                    }
                }}
            >
                <MenuItem value={1}>Small</MenuItem>
                <MenuItem value={2}>Large</MenuItem>
            </Select>
        </FormControl>
    );
}

export default CustomSelect;