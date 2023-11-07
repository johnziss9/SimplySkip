import React, { useState, useContext } from 'react';
import './Reminders.css';
import RemindersCard from '../../components/RemindersCard/RemindersCard';

function Reminders() {
    return (
        <>
            <div className='reminders-container'>
                <div className='reminders-section'>
                    <div className='reminders-cards'>
                        <RemindersCard
                            statusBorder="6px solid green"
                            status="UNPAID"
                            lastName="PAPAVASILIOU"
                            firstName="Panayiotis"
                            hireDate="07/12/2023"
                            numberOfDays='23'
                        />
                        <RemindersCard
                            statusBorder="6px solid red"
                            status="UNPAID"
                            lastName="PAPAVASILIOU"
                            firstName="Panayiotis"
                            hireDate="07/12/2023"
                            numberOfDays='23'
                        />
                        <RemindersCard
                            statusBorder="6px solid green"
                            status="UNPAID"
                            lastName="PAPAVASILIOU"
                            firstName="Panayiotis"
                            hireDate="07/12/2023"
                            numberOfDays='23'
                        />
                        <RemindersCard
                            statusBorder="6px solid green"
                            status="UNPAID"
                            lastName="PAPAVASILIOU"
                            firstName="Panayiotis"
                            hireDate="07/12/2023"
                            numberOfDays='23'
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Reminders;