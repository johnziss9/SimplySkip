import React from "react";
import { TextField } from "@mui/material";


function CustomTextField(props) {

    return (
        <TextField
            label={props.label}
            variant="outlined"
            margin={props.margin}
            type={props.type}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#006d77", // Changes border style when not focused
                        borderRadius: 0,
                    },
                        '&:hover fieldset': {
                          border: "2px solid" // Changes border style on focus
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#006d77', // Changes border style when focused
                        },
                }
            }}
            InputProps={{
                style: {
                    color: "#006d77" // Changes the font color when focused
                },
            }}
            InputLabelProps={{
                style: { color: '#006d77' } // Changes the label when focus and when not
            }}
        />
    );
}

export default CustomTextField;