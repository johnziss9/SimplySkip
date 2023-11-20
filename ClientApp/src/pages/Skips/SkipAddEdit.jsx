import React, { useState } from "react";
import './SkipAddEdit.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomSelect from "../../components/CustomSelect/CustomSelect";

function SkipAddEdit() {

    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [notes, setNotes] = useState('');

    return (
        <>
            <CustomNavbar currentPage={'Skip Information'} />
            <div className='skip-add-edit-container'>
                <div className="skip-add-edit-form">
                    <CustomTextField label={'Skip Name'} variant={'outlined'} required={true} margin={'normal'} width={'440px'} onChange={e => setName(e.target.value)} value={name} />
                    <CustomSelect value={size} onChange={e => setSize(e.target.value)} />
                    <CustomTextField label={'Notes'} variant={'outlined'} margin={'normal'} required={false} multiline={true} rows={4} width={'440px'} value={notes || ''} onChange={e => setNotes(e.target.value)} />
                    <div className="skip-add-edit-form-buttons">
                        <CustomButton backgroundColor={"#83c5be"} buttonName={"Cancel"} width={"200px"} height={"50px"} margin={'20px 10px 0 0'} />
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Submit"} width={"200px"} height={"50px"} margin={'20px 0 0 10px'} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default SkipAddEdit;