import React, { useState } from "react";
import { Card, Collapse, IconButton, Typography } from "@mui/material";
import CardContent from '@mui/material/CardContent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

function BookingCard(props) {
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
            <CardContent sx={{ paddingBottom: '17px !important' }}>
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
                    <IconButton sx={{ padding: '7px 7px 0 7px' }} onClick={props.onClickView} >
                        <VisibilityIcon />
                    </IconButton>
                    <IconButton sx={{ padding: '7px 7px 0 7px' }} onClick={props.onClickEdit} >
                        <EditIcon />
                    </IconButton>
                    <IconButton sx={{ padding: '7px 7px 0 7px' }} onClick={props.onClickCancel} >
                        <DoNotDisturbIcon />
                    </IconButton>
                </Collapse>
            </CardContent>
        </Card>

    );
}

export default BookingCard;