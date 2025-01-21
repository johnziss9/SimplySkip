import React, { useState } from "react";
import './CustomNavbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Button, IconButton, Toolbar, Typography, Fab, useMediaQuery } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';

function CustomNavbar(props) {
    const [open, setOpen] = useState(false);

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
                    </Typography>
                    {props.currentPage === 'Πελἀτες' || props.currentPage === 'Κρατἠσεις' || props.currentPage === 'Skips' || (props.currentPage && props.currentPage.includes('Κρατἠσεις για')) ?
                    <Fab sx={{ background: '#edf6f9', width: '40px', height:'40px', marginLeft: '12px', borderRadius: '100%', fontSize: '12px' }} onClick={handleAddNew}>
                        <AddIcon sx={{ fontSize: '32px', color: '#006d77' }} />
                    </Fab>
                    : null}
                </div>
                <LogoutIcon sx={{ fontSize: '30px' }} />
            </Toolbar>
            {open && (
                <div className="menu-container">
                    <Button color="inherit" sx={{ fontSize: '18px', marginTop: '5px' }}><Link className='menu-item' to="/Customers">ΠΕΛΑΤΕΣ</Link></Button>
                    <Button color="inherit" sx={{ fontSize: '18px', marginTop: '5px' }}><Link className='menu-item' to="/Bookings">ΚΡΑΤΗΣΕΙΣ</Link></Button>
                    <Button color="inherit" sx={{ fontSize: '18px', marginTop: '5px' }}><Link className='menu-item' to="/Skips">Skips</Link></Button>
                    <Button color="inherit" sx={{ fontSize: '18px', marginTop: '5px' }}><Link className='menu-item' to="/History">ΙΣΤΟΡΙΚΟ</Link></Button>
                </div>
            )}
        </AppBar>
    );
}

export default CustomNavbar;