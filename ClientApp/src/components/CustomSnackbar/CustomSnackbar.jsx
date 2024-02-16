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
                    sx={{
                        margin: '20px 0'
                    }}
                    action={(
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={props.onClickIcon}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                >
                    {props.content}
                </Alert>
            </Snackbar>
    );
}

export default CustomSnackbar;