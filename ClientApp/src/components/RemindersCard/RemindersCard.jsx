import React, { useState } from "react";
import { Card, Collapse, FormControlLabel, IconButton, Switch, Typography } from "@mui/material";
import CardContent from '@mui/material/CardContent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function RemindersCard(props) {
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
                    {props.hireDate} ({props.numberOfDays} Days)
                </Typography>

                <IconButton onClick={handleExpand} sx={{ padding: 0 }} >
                    {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>

                <Collapse in={expanded}>
                    <FormControlLabel control={<Switch />} label="Returned" />
                    <FormControlLabel control={<Switch />} label="Paid" />
                </Collapse>
            </CardContent>
        </Card>

    );
}

export default RemindersCard;