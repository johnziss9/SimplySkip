import React, { useState } from "react";
import './CustomNavbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

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
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                    {props.currentPage}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
            {open && (
                <div className="menu-container">
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/Reminders">Reminders</Link></Button>
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/Customers">Customers</Link></Button>
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/Bookings">Bookings</Link></Button>
                </div>
            )}
        </AppBar>
    );
}

export default CustomNavbar;