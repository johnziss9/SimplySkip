import React, { useState, useEffect } from "react";
import './Skips.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import SkipCard from "../../components/SkipCard/SkipCard";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

function Skips() {

    const [skips, setSkips] = useState([]);
    const [selectedValue, setSelectedValue] = useState('All'); // Handling the Radio Buttons

    useEffect(() => {
        handleFetchSkips();
        // eslint-disable-next-line
    }, []);

    const handleFetchSkips = async () => {
        const response = await fetch("https://localhost:7197/skip/", {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });

        if (response.ok) {
            const skips = await response.json();

            setSkips(skips);
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const getBookedSkips = () => {
        return skips.filter((skip) => skip.rented);
    };

    const getAvailableSkips = () => {
        return skips.filter((skip) => !skip.rented);
    };


    const filteredSkips = selectedValue === 'Booked' ? getBookedSkips() : selectedValue === 'Available' ? getAvailableSkips() : skips;

    return (
        <>
            <CustomNavbar currentPage={'Skips'} addNewClick={'/Skip'} />
            <div className='skips-container'>
                <RadioGroup sx={{ marginTop: '20px' }} value={selectedValue} onChange={handleRadioChange} row>
                    <FormControlLabel value="All" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="All" />
                    <FormControlLabel value="Booked" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Booked" />
                    <FormControlLabel value="Available" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Available" />
                </RadioGroup>
                <div className="skips-section">
                    {Array.isArray(filteredSkips) ? filteredSkips.map((skip) => (
                        <SkipCard
                            key={skip.id}
                            statusBorder={skip.rented ? "10px solid red" : "10px solid green"}
                            name={`Skip ${skip.name}`}
                            size={skip.skipSize === 1 ? 'Small' : 'Large'}
                        />
                    )) : null}
                </div>
            </div>
        </>
    );
}

export default Skips;