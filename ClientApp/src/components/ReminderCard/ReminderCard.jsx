import React, { useState } from "react";
import { Card, Collapse, FormControlLabel, IconButton, Switch, Typography } from "@mui/material";
import CardContent from '@mui/material/CardContent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function ReminderCard(props) {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{
            minWidth: 275,
            maxWidth: 275,
            backgroundColor: '#fff',
            borderTop: props.statusBorder,
            margin: '15px'
        }}>
            <CardContent>
                <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px', textTransform: 'uppercase' }} >
                    {props.lastName}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '19px', margin: '5px' }} >
                    {props.firstName}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '18px', margin: '5px' }} >
                    {props.hireDate} 
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '18px', margin: '5px' }} >
                    {props.returnDateOrDays}
                </Typography>
                <IconButton onClick={handleExpand} sx={{ padding: 0 }} >
                    {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                <Collapse in={expanded}>
                    <FormControlLabel 
                        control={
                            <Switch 
                                disabled={props.disableReturnedSwitch} 
                                checked={props.booking.returned}
                                onChange={() => {
                                    if (!props.booking.returned) {
                                        props.onReturnedSwitchChange();
                                    }
                                }}
                            />
                        } 
                        label="Returned" 
                    />
                    <FormControlLabel 
                        control={
                            <Switch 
                                disabled={props.disablePaidSwitch}
                                checked={props.booking.paid}
                                onChange={() => {
                                    if (!props.booking.paid) {
                                        props.onPaidSwitchChange();
                                    }
                                }}
                            />
                        } 
                        label="Paid" 
                    />
                </Collapse>
            </CardContent>
        </Card>

    );
}

export default ReminderCard;