import React, { useState } from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import CustomButton from '../../components/CustomButton/CustomButton';
import Logo from '../../images/logo.png';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';

function Home() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    const baseUrl = process.env.REACT_APP_URL;

    const handleLogin = async () => {
        const response = await fetch(`${baseUrl}/auth/login`, {
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
            navigate('/Bookings');
        } else {
            const data = await response.json();
            const { title } = data;

            setSnackbarMessage(title);
            setShowSnackbar(true);
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbarMessage(false);
        setShowSnackbar('');
    };

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
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity="error" />
        </>
    )
}

export default Home;