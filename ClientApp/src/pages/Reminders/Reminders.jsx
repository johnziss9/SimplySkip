import React, { useState, useContext } from 'react';
import './Reminders.css';
import RemindersCard from '../../components/RemindersCard/RemindersCard';

function Reminders() {

    // TODO Add condition to show the number of days if the skip hasn't been returned of the return date

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
                            returnDateOrDays="15 Days"
                        />
                        <RemindersCard
                            statusBorder="6px solid red"
                            status="UNPAID"
                            lastName="PAPAVASILIOU"
                            firstName="Panayiotis"
                            hireDate="07/12/2023"
                            returnDateOrDays="07/12/2023"
                        />
                        <RemindersCard
                            statusBorder="6px solid green"
                            status="UNPAID"
                            lastName="PAPAVASILIOU"
                            firstName="Panayiotis"
                            hireDate="07/12/2023"
                            returnDateOrDays="15 Days"
                        />
                        <RemindersCard
                            statusBorder="6px solid green"
                            status="UNPAID"
                            lastName="PAPAVASILIOU"
                            firstName="Panayiotis"
                            hireDate="07/12/2023"
                            returnDateOrDays="07/12/2023"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Reminders;