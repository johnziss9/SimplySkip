import React, { useState } from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import CustomButton from '../../components/CustomButton/CustomButton';
import Logo from '../../images/logo.png';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import handleHttpRequest from '../../api/api';

function Home() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleLogin = async () => {
        const url = '/auth/login/';
        const method = 'POST';
        const body = {
            username,
            password
        };

        const { success, data } = await handleHttpRequest(url, method, body);

        if (success) {
            const { token, userId } = data;

            sessionStorage.setItem('userId', userId);
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('token', token);
            navigate('/Bookings');
        } else {
            if (!username || !password)
                setSnackbarMessage('Το Username και το Password δεν μπορούν να είναι κενά.');
            else
                setSnackbarMessage('Λἀθως Username ἠ Password.');
            setShowSnackbar(true);
        }
    }

    const handleKeyDown = (e) => {
        const key = e.key || e;
        if (key === 'Enter') {
            handleLogin();
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarMessage('');
        setShowSnackbar(false);
    };

    return (
        <>
            <div className='home-container'>
                <div className='home-login-section'>
                    <div className='home-logo-container'>
                        <img src={Logo} alt='logo' className='home-logo-image' />
                    </div>
                    <CustomTextField label={"Username"} variant={"outlined"} margin={"dense"} onChange={e => setUsername(e.target.value)} value={username} onKeyDown={handleKeyDown} />
                    <CustomTextField label={"Password"} variant={"outlined"} margin={"dense"} type={"password"} onChange={e => setPassword(e.target.value)} value={password} onKeyDown={handleKeyDown} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Login"} width={"200px"} height={"50px"} margin={"20px 0 0 0"} onClick={handleLogin} />
                </div>
            </div>
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity="error" />
        </>
    )
}

export default Home;