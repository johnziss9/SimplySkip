import React, { useState } from "react";
import { Card, CardContent, Collapse, IconButton, Typography } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function SkipCard(props) {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = (e) => {
        e.stopPropagation(); // Makes sure the icon is opening the modal and not navigating user to the address page
        setExpanded(!expanded);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        props.onClickEdit();
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        props.onClickDelete();
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
                <Typography variant="body2" sx={{ fontSize: '18px', margin: '5px' }} >
                    {props.name} <span style={{ fontSize: '14px' }}>({props.size})</span>
                </Typography>
                {props.rented ?
                    <>
                        <Typography variant="body2" sx={{ fontSize: '18px', margin: '5px' }} >
                            {props.hireDate}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '18px', margin: '5px' }} >
                            {props.returnDateOrDays}
                        </Typography>
                    </> : null}
                <IconButton onClick={handleExpand} sx={{ padding: 0 }} >
                    {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                <Collapse in={expanded}>
                    <IconButton sx={{ padding: '7px 7px 0 7px' }} onClick={handleEdit} >
                        <EditIcon />
                    </IconButton>
                    <IconButton  sx={{ padding: '7px 7px 0 7px' }} onClick={handleDelete} disabled={props.disabledDeleteButton} >
                        <DeleteIcon  />
                    </IconButton>
                </Collapse>
            </CardContent>
        </Card>
    );
}

export default SkipCard;