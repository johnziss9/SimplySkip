import React, { useState } from "react";
import './CustomNavbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Button, IconButton, Toolbar, Typography, Fab } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

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
                    {props.currentPage === 'Customers' || props.currentPage === 'Bookings' || props.currentPage === 'Skips' ?
                    <Fab sx={{ background: '#edf6f9', width: '150px', height:'40px', marginLeft: '20px', borderRadius: '5px' }} onClick={handleAddNew}>
                        <AddIcon sx={{ color: '#006d77' }} />
                        ADD NEW
                    </Fab>
                    : null}
                </div>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
            {open && (
                <div className="menu-container">
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/Customers">Customers</Link></Button>
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/Bookings">Bookings</Link></Button>
                    <Button color="inherit" sx={{ fontSize: '18px' }}><Link className='menu-item' to="/Skips">Skips</Link></Button>
                </div>
            )}
        </AppBar>
    );
}

export default CustomNavbar;