import React, { useState } from "react";
import './CustomNavbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Button, IconButton, Toolbar, Typography, Fab, useMediaQuery } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

function CustomNavbar(props) {
    const [open, setOpen] = useState(false);

    const addNewButtonWidth = useMediaQuery('(max-width: 550px)');

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
                    <Fab sx={{ background: '#edf6f9', width: addNewButtonWidth ? '50px' : '150px', height:'40px', marginLeft: '20px', borderRadius: '5px', fontSize: '12px' }} onClick={handleAddNew}>
                        <AddIcon sx={{ color: '#006d77' }} />
                        {addNewButtonWidth ? '' : 'ΠΡΟΣΘΗΚΗ ΝΕΟΥ'}
                    </Fab>
                    : null}
                </div>
                <Button color="inherit" onClick={handleLogout}>ΑΠΟΣΥΝΔΕΣΗ</Button>
            </Toolbar>
            {open && (
                <div className="menu-container">
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/Customers">ΠΕΛΑΤΕΣ</Link></Button>
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/Bookings">ΚΡΑΤΗΣΕΙΣ</Link></Button>
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/Skips">Skips</Link></Button>
                </div>
            )}
        </AppBar>
    );
}

export default CustomNavbar;