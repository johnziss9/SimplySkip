import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

function CustomDatePicker(props) {

    const StyledDay = styled(PickersDay)(({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        color: '#006d77'
    }));

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={props.label}
                slots={{
                    day: StyledDay
                }}
                value={dayjs(props.value)}
                onChange={props.onChange}
                disabled={props.disabled}
                minDate={props.minDate}
                format="DD/MM/YYYY"
                sx={{
                    "& .MuiInputLabel-root.Mui-focused": { color: "#006d77" }, // Change the label colour on focus
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
                    input: { color: '#006d77' }, // Changes the colour of the font inside the datepicker
                    svg: { color: '#006d77' }, // Changes the colour of the calendar icon
                    label: { color: '#006d77' }, // Changes the colour of the label when not focused
                    width: props.width,
                    margin: '16px 0 8px 0'
                }}
            />
        </LocalizationProvider>
    );
}

export default CustomDatePicker;