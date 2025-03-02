import React, { useState } from "react";
import { Card, Collapse, IconButton, Typography } from "@mui/material";
import CardContent from '@mui/material/CardContent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function CustomerCard(props) {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = (e) => {
        e.stopPropagation(); // Makes sure the icon is opening the modal and not navigating user to the address page
        setExpanded(!expanded);
    };

    // Function to remove diacritics from Greek text
    const removeDiacritics = (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    // Component to render text in uppercase without diacritics
    const UppercaseWithoutDiacritics = (props) => {
        const { lastName } = props;
        const lastNameUppercase = removeDiacritics(lastName.toUpperCase());

        return (
            <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }}>
                {lastNameUppercase}
            </Typography>
        );
    };

    return (
        <Card sx={{
            minWidth: 275,
            maxWidth: 275,
            backgroundColor: '#fff',
            borderTop: props.statusBorder,
            margin: '15px',
            cursor: props.onClick ? 'pointer' : 'default'
        }}
        onClick={props.onClick}
        >
            <CardContent sx={{ paddingBottom: '17px !important' }}>
                <UppercaseWithoutDiacritics lastName={props.lastName} />
                <Typography variant="body2" sx={{ fontSize: '19px', margin: '5px' }} >
                    {props.firstName}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '18px', margin: '5px' }} >
                    {props.phone}
                </Typography>
                <IconButton onClick={handleExpand} sx={{ padding: 0 }} >
                    {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                <Collapse in={expanded}>
                    <IconButton sx={{ padding: '7px 7px 0 7px' }} onClick={props.onClickEdit} >
                        <EditIcon />
                    </IconButton>
                    <IconButton sx={{ padding: '7px 7px 0 7px' }} onClick={props.onClickDelete} >
                        <DeleteIcon />
                    </IconButton>
                </Collapse>
            </CardContent>
        </Card>

    );
}

export default CustomerCard;