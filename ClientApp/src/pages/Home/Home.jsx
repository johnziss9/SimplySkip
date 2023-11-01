import React from 'react';
import './Home.css';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import CustomButton from '../../components/CustomButton/CustomButton';

function Home() {

    return (
        <>
            <div className='home-container'>
                <div className='home-login-section'>
                    <h1 className='home-title'>Simply Skip</h1>
                    <CustomTextField label={"Username"} margin={"dense"} />
                    <CustomTextField label={"Password"} margin={"dense"} type={"password"} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Login"} width={"200px"} height={"50px"} marginTop={"20px"} />
                </div>
            </div>
        </>
    )
}

export default Home;