import React, { useState } from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import CustomButton from '../../components/CustomButton/CustomButton';
import { Alert, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Logo from '../../images/logo.png';

function Home() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userLoginFailed, setUserLoginFailed] = useState(false);
    const [errorStatus, setErrorStatus] = useState('');

    const handleLogin = async () => {
        const response = await fetch("https://localhost:7197/auth/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (response.ok) {
            const data = await response.json();
            const { token } = data;

            sessionStorage.setItem('token', token);
            navigate('/Reminders');
        } else {
            const data = await response.json();
            const { title } = data;

            setErrorStatus(title);

            handleShowFailedLogin();
        }
    }

    const handleShowFailedLogin = () => setUserLoginFailed(true);
    const handleHideFailedLogin = () => setUserLoginFailed(false);

    return (
        <>
            <div className='home-container'>
                <div className='home-login-section'>
                    <div className='home-logo-container'>
                        <img src={Logo} alt='logo' className='home-logo-image' />
                    </div>
                    <CustomTextField label={"Username"} variant={"outlined"} margin={"dense"} onChange={e => setUsername(e.target.value)} value={username} />
                    <CustomTextField label={"Password"} variant={"outlined"} margin={"dense"} type={"password"} onChange={e => setPassword(e.target.value)} value={password} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Login"} width={"200px"} height={"50px"} margin={"20px 0 0 0"} onClick={handleLogin} />
                </div>
            </div>
            <Snackbar
                open={userLoginFailed}
                autoHideDuration={4000}
                onClose={handleHideFailedLogin}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                ClickAwayListenerProps={{ onClickAway: () => null }}
            >
                <Alert
                    severity="error"
                    action={(
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleHideFailedLogin}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}>{errorStatus}</Alert>
            </Snackbar>
        </>
    )
}

export default Home;