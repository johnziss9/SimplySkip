import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails, Typography, Fab, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CustomButton from '../CustomButton/CustomButton';
import handleHttpRequest from "../../api/api";

function UpdatesButton({ showDialog, setShowDialog, isButton = true }) {
    const [updateHistory, setUpdateHistory] = useState([]);
    const [expanded, setExpanded] = useState('panel0');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showDialog) {
            handleGetUpdates();
        }
    }, [showDialog]);

    const handleGetUpdates = async () => {
        setLoading(true);
        try {
            const url = '/update';
            const method = 'GET';

            const { success, data } = await handleHttpRequest(url, method);

            if (success) {
                // Process the data
                const formattedUpdates = data.map(update => ({
                    id: update.id,
                    date: new Date(update.timestamp).toLocaleDateString(),
                    title: update.title,
                    // Parse the JSON string to an array of updates
                    updates: update.updates ? JSON.parse(update.updates) : []
                }));

                // Sort by date (newest first)
                formattedUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));

                setUpdateHistory(formattedUpdates);

                // Set the most recent update as expanded
                if (formattedUpdates.length > 0) {
                    setExpanded('panel0');
                }
            } else {
                console.error('Failed to fetch updates');
            }
        } catch (error) {
            console.error('Error fetching updates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            {isButton && (
                <Fab
                    sx={{
                        background: '#edf6f9',
                        width: '40px',
                        height: '40px',
                        marginLeft: '12px',
                        borderRadius: '100%',
                        fontSize: '12px'
                    }}
                    onClick={() => setShowDialog(true)}
                >
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
                maxWidth="md"
            >
                <DialogTitle sx={{ width: '100%', borderBottom: '1px solid #006d77', marginBottom: '10px' }}>
                    Ιστορικό Ενημερώσεων
                </DialogTitle>
                <DialogContent>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <CircularProgress sx={{ color: '#006d77' }} />
                        </div>
                    ) : updateHistory.length > 0 ? (
                        updateHistory.map((update, index) => (
                            <Accordion
                                key={index}
                                expanded={expanded === `panel${index}`}
                                onChange={handleChange(`panel${index}`)}
                                sx={{
                                    marginBottom: '8px',
                                    '&.Mui-expanded': {
                                        borderLeft: '4px solid #006d77'
                                    }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`panel${index}-content`}
                                    id={`panel${index}-header`}
                                    sx={{
                                        backgroundColor: expanded === `panel${index}` ? '#edf6f9' : 'inherit',
                                        '&:hover': {
                                            backgroundColor: '#f1f8f9'
                                        }
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {update.date} - {update.title}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: '#fafafa' }}>
                                    {update.updates.map((item, itemIndex) => (
                                        <div key={itemIndex} style={{ margin: '10px 0', fontSize: '17px' }}>
                                            • {item}
                                        </div>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))
                    ) : (
                        <Typography sx={{ padding: '20px', textAlign: 'center' }}>
                            Δεν υπάρχουν διαθέσιμες ενημερώσεις
                        </Typography>
                    )}
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