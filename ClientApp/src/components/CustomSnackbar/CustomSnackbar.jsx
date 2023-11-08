import React from "react";
import { Alert, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function CustomSnackbar(props) {
    return (
        <Snackbar
            open={props.open}
            autoHideDuration={4000}
            onClose={props.onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            ClickAwayListenerProps={{ onClickAway: () => null }}
        >
            <Alert
                severity={props.severity}
                action={(
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={props.onClick}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}>{props.value}</Alert>
        </Snackbar>
    );
}

export default CustomSnackbar;