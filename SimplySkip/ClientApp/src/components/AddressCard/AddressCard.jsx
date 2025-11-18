import { useState } from "react";
import { Card, Typography, Box, Divider, IconButton, Dialog, DialogActions, DialogTitle, DialogContent, Collapse} from "@mui/material";
import CardContent from '@mui/material/CardContent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import CustomButton from "../CustomButton/CustomButton";

function AddressCard(props) {
    const {
        address,
        bookingCount,
        characterThreshold = 80,
        onClick,
        onClickEdit,
        disabledEditButton = false
    } = props;

    const [viewAddresModal, setViewAddressModal] = useState(false);
    const [expanded, setExpanded] = useState(false);
    
    const isLikelyOverflowing = address.length > characterThreshold;

    const handleOpenModal = (e) => {
        e.stopPropagation(); // Makes sure the icon is opening the modal and not navigating user to the address page
        setViewAddressModal(true);
    }
    const handleCloseModal = () => setViewAddressModal(false);

    const handleExpand = (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onClickEdit();
    };

    return (
        <>
            <Card sx={{
                minWidth: 275,
                maxWidth: 275,
                minHeight: 195,
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
                    position: 'relative'
                }}>
                    <Box sx={{ 
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: '19px',
                                margin: '5px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <IconButton onClick={handleExpand} sx={{ padding: 0, marginLeft: '5px' }}>
                            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </Box>
                    <Collapse in={expanded}>
                        <IconButton 
                            sx={{ padding: '7px 7px 0 7px' }} 
                            onClick={handleEdit} 
                            disabled={disabledEditButton}
                        >
                            <EditIcon />
                        </IconButton>
                    </Collapse>
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