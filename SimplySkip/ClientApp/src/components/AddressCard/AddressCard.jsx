import React, { useState } from "react";
import { Card, Typography, Box, Divider, IconButton, Dialog, DialogActions, DialogTitle, DialogContent} from "@mui/material";
import CardContent from '@mui/material/CardContent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomButton from "../CustomButton/CustomButton";

function AddressCard(props) {
    const {
        address,
        bookingCount,
        characterThreshold = 80,
        onClick
    } = props;

    const [viewAddresModal, setViewAddressModal] = useState(false);
    
    const isLikelyOverflowing = address.length > characterThreshold;

    const handleOpenModal = (e) => {
        e.stopPropagation(); // Makes sure the icon is opening the modal and not navigating user to the address page
        setViewAddressModal(true);
    }
    const handleCloseModal = () => setViewAddressModal(false);

    return (
        <>
            <Card sx={{
                minWidth: 275,
                maxWidth: 275,
                height: 195,
                backgroundColor: '#fff',
                borderTop: '10px solid #83c5be',
                margin: '15px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                cursor: onClick ? 'pointer' : 'default'
            }}
            onClick={onClick}
            >
                <CardContent sx={{
                    padding: '16px',
                    paddingBottom: '17px !important',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    position: 'relative'
                }}>
                    <Box sx={{ 
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        flexGrow: 1,
                        overflow: 'hidden',
                        marginBottom: 'auto'
                    }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: '19px',
                                margin: '5px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3, // Number of lines to show before overflow
                                WebkitBoxOrient: 'vertical',
                                paddingRight: isLikelyOverflowing ? 4 : 0
                            }}
                        >
                            {address}
                        </Typography>

                        {isLikelyOverflowing && (
                            <IconButton
                                size="small"
                                onClick={handleOpenModal}
                                sx={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 0,
                                    color: '#757575'
                                }}
                            >
                                <VisibilityIcon />
                            </IconButton>
                        )}
                    </Box>

                    <Box sx={{
                        marginTop: 'auto',
                        width: '100%'
                    }}>
                        <Divider sx={{ mb: 1 }} />
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Typography variant="body2" sx={{ color: '#757575', marginRight: 1 }}>
                                Σύνολο Κρατήσεων:
                            </Typography>
                            <Typography variant="h4" sx={{
                                fontWeight: 'bold',
                                color: '#83c5be'
                            }}>
                                {bookingCount}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Dialog 
                open={viewAddresModal} 
                onClose={(event, reason) => { 
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { 
                        handleCloseModal(event, reason) 
                    } 
                }}
            >
                <DialogTitle sx={{ width: '400px' }}>
                    Πληροφορίες Διεύθυνσης
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {address}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <CustomButton 
                        backgroundColor={"#006d77"} 
                        buttonName={"OK"} 
                        width={"100px"} 
                        height={"45px"} 
                        onClick={handleCloseModal} 
                    />
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddressCard;