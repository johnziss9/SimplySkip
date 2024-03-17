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
                        <h1 className="not-found-title">Ουπς...</h1>
                        <p className="not-found-text">Η σελίδα που ψάχνετε δεν μπορεί να βρεθεί. Κάντε κλικ στο κουμπί για να επιστρέψετε στις κρατήσεις.</p>
                        <CustomButton backgroundColor={"#006d77"} buttonName={"ΚΡΑΤΗΣΕΙΣ"} width={"150px"} height={"45px"} onClick={handleNagivation} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotFound;