import React from "react";
import { TextField } from "@mui/material";

function CustomTextField(props) {
    return (
        <TextField
            label={props.label}
            variant={props.variant}
            margin={props.margin}
            type={props.type}
            onChange={props.onChange}
            value={props.value}
            required={props.required}
            disabled={props.disabled}
            multiline={props.multiline}
            rows={props.rows}
            maxRows={props.maxRows}
            error={props.error}
            sx={{
                // Styles for the outlined variant
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#006d77", // Changes border style when not focused
                        borderRadius: 0,
                    },
                    '&:hover fieldset': {
                        border: "2px solid #006d77", // Changes border style on hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#006d77 !important', // Changes border style when focused
                    },
                },
                // Styles for the standard variant
                '& .MuiInputBase-root': {
                    '&::before': {
                        borderBottom: '1px solid #006d77', // Change border style when not focused
                    },
                    '&:hover::before': {
                        borderBottom: '2px solid #006d77', // Change border style on hover
                    },
                    '&.Mui-focused::before': {
                        borderBottom: '2px solid #006d77', // Change border style when focused
                    },
                    '&::after': {
                        borderBottom: 'none', // Removed 2px blue border-bottom 
                    }
                },
                width: props.width,
                display: props.display
            }}
            InputProps={{
                style: {
                    color: "#006d77" // Changes the font color when focused
                }
            }}
            InputLabelProps={{
                style: { color: '#006d77' } // Changes the label when focus and when not
            }}
        />
    );
}

export default CustomTextField;