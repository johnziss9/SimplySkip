import React, { useState } from "react";
import './CustomNavbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Button, IconButton, Toolbar, Typography, Fab } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import UpdatesButton from "../UpdatesButton/UpdatesButton";

function CustomNavbar(props) {
    const [open, setOpen] = useState(false);
    const [showUpdates, setShowUpdates] = useState(false);

    const navigate = useNavigate();

    const handleMenuClick = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    }

    const handleAddNew = () => {
        if (props.customerId)
            localStorage.setItem('CustomerId', props.customerId);

        sessionStorage.setItem('AddNewSource', props.addNewSource);
        navigate(props.addNewClick);
    }

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#006d77' }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenuClick}
                    sx={{ mr: 2 }}
                >
                    {open ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
                <div className="custom-navbar-content">
                    <Typography variant="h5">
                        {props.currentPage}
                        {props.customerName}
                    </Typography>
                    {
                        props.currentPage === 'Πελἀτες' || 
                        props.currentPage === 'Κρατἠσεις' || 
                        props.currentPage === 'Skips' || 
                        (props.currentPage && props.currentPage.includes('Κρατἠσεις για')) ? (
                            <Fab sx={{ background: '#edf6f9', width: '40px', height: '40px', marginLeft: '12px', borderRadius: '100%', fontSize: '12px' }} onClick={handleAddNew}>
                                <AddIcon sx={{ fontSize: '32px', color: '#006d77' }} />
                            </Fab>
                    ) : null}

                    {
                        props.currentPage === 'Πελἀτες' || 
                        props.currentPage === 'Κρατἠσεις' || 
                        props.currentPage === 'Skips' || 
                        props.currentPage === 'Διευθύνσεις' || 
                        (props.currentPage && props.currentPage.includes('Κρατἠσεις για')) ? (
                            <UpdatesButton showDialog={showUpdates} setShowDialog={setShowUpdates} />
                    ) : null}
                </div>
                <Fab sx={{ background: '#edf6f9', width: '40px', height: '40px', marginLeft: '12px', borderRadius: '100%', fontSize: '12px' }} onClick={handleLogout}>
                    <LogoutIcon sx={{ fontSize: '30px', color: '#006d77' }} />
                </Fab>

            </Toolbar>
            {open && (
                <div className="menu-container">
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/Customers">ΠΕΛΑΤΕΣ</Link></Button>
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/Bookings">ΚΡΑΤΗΣΕΙΣ</Link></Button>
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/Skips">Skips</Link></Button>
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/History">ΙΣΤΟΡΙΚΟ</Link></Button>
                </div>
            )}
        </AppBar>
    );
}

export default CustomNavbar;