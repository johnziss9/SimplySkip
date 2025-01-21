import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Fab } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CustomButton from '../CustomButton/CustomButton';

// isButton: Establishes whether to show the button or not when calling this component.
function UpdatesButton({ showDialog, setShowDialog, isButton = true, title = "Πρόσφατες Ενημερώσεις - 21/02/2025" }) {
    const updates = [
        "Νέο κουμπί φίλτρων στις σελίδες Κρατήσεων και Skips για εύκολη προβολή και διαχείριση φίλτρων",
        "Βελτιωμένη φόρτωση δεδομένων: Τα στοιχεία φορτώνονται σταδιακά (15 ανά φόρτωση) καθώς ο χρήστης κάνει κύλιση στη σελίδα",
        "Προσθήκη συνολικού αριθμού εγγραφών σε κάθε σελίδα",
        "Προσθήκη αριθμού εγγραφών δίπλα από κάθε φίλτρο",
        "Νέα σχεδίαση για τα κουμπιά 'Προσθήκη Νέου' και 'Αποσύνδεση'",
        "Προσθήκη νέου κουμπιού ενημερώσεων για την προβολή τρεχουσών και μελλοντικών αναβαθμίσεων του συστήματος"
    ];

    return (
        <>
            {isButton && (
                <Fab sx={{ background: '#edf6f9', width: '40px', height: '40px', marginLeft: '12px', borderRadius: '100%', fontSize: '12px' }} onClick={() => setShowDialog(true)}>
                    <NotificationsIcon sx={{ fontSize: '24px', color: '#006d77' }} />
                </Fab>
            )}

            <Dialog 
                open={showDialog} 
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        setShowDialog(false);
                    }
                }}
            >
                <DialogTitle sx={{ width: '100%', borderBottom: '1px solid #006d77', marginBottom: '10px' }}>
                    {title}
                </DialogTitle>
                <DialogContent>
                    {updates.map((update, index) => (
                        <div key={index} style={{ margin: '10px 0', fontSize: '17px' }}>
                            • {update}
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <CustomButton 
                        backgroundColor="#006d77"
                        buttonName="OK"
                        width="100px"
                        height="45px"
                        onClick={() => setShowDialog(false)}
                    />
                </DialogActions>
            </Dialog>
        </>
    );
}

export default UpdatesButton;