import React from "react";
import './NotFound.css';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigate } from "react-router-dom";

function NotFound() {

    const navigate = useNavigate();

    const handleNagivation = () => {
        navigate('/Bookings');
    }

    return (
        <>
            <div className="not-found-container">
                <div className="not-found-section">
                    <div className="not-found-message">
                        <h1 className="not-found-title">OOPS...</h1>
                        <p className="not-found-text">The page you're looking for cannot be found. Click the button to go back to bookings.</p>
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Bookings"} width={"100px"} height={"45px"} onClick={handleNagivation} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotFound;