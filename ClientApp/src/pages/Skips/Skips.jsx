import React, { useState, useEffect } from "react";
import './Skips.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import SkipCard from "../../components/SkipCard/SkipCard";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from "@mui/material";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";

function Skips() {

    const navigate = useNavigate();

    const [skips, setSkips] = useState([]);
    const [skip, setSkip] = useState({});
    const [booking, setBooking] = useState({});
    const [customer, setCustomer] = useState({});
    const [selectedValue, setSelectedValue] = useState('All'); // Handling the Radio Buttons
    const [openViewSkip, setOpenViewSkip] = useState(false); // Handling the View Skip Dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);

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

    const handleFetchBookingDetails = async (bookingId) => {
        try {
            const bookingResponse = await fetch(`https://localhost:7197/booking/skip/${bookingId}`, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });

            if (bookingResponse.ok) {
                const booking = await bookingResponse.json();

                setBooking(booking);

                const customerId = booking.customerId;

                const customerResponse = await fetch(`https://localhost:7197/customer/${customerId}`, {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                });

                if (customerResponse.ok) {
                    const customer = await customerResponse.json();

                    setCustomer(customer)
                } else {
                    // TODO Handle error if cards don't load
                }
            } else {
                // TODO Handle error if cards don't load
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // TODO Handle generic error
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

    const handleEditClick = (id) => {
        navigate(`/Skip/${id}`);
    }

    const handleDeleteClick = async (id) => {
        const response = await fetch(`https://localhost:7197/skip/${id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                name: skip.name,
                size: skip.size,
                notes: skip.notes.replace(/\n/g, ', '),
                rented: skip.rented,
                deleted: true
            })
        });

        if (response.ok) {
            handleCloseDeleteDialog();
            handleShowDeleteSuccess();
        } else {
            // TODO Handle error if cards don't load
        }
    }

    const handleOpenViewSkip = (skip) => {
        setOpenViewSkip(true);

        if (skip.rented) {
            handleFetchBookingDetails(skip.id)
        }

        setSkip(skip);
    }
    const handleCloseViewSkip = () => setOpenViewSkip(false);

    const handleShowDeleteDialog = (skip) => {
        setSkip(skip);
        setOpenDeleteDialog(true);
    }
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleShowDeleteSuccess = () => setOpenDeleteSuccess(true);
    const handleCloseDeleteSuccess = () => {
        setOpenDeleteSuccess(false);
        handleFetchSkips();
    }

    const filteredSkips = selectedValue === 'Booked' ? getBookedSkips() : selectedValue === 'Available' ? getAvailableSkips() : skips;

    function handleCalculateDays(hireDate) {
        const dateOfHire = new Date(hireDate);
        const today = new Date();
        const timeDifference = today - dateOfHire;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

        if (days > 0)
            return 'Rented for ' + Math.abs(days) + ' Days';
        else if (days === 0)
            return 'Rented Today'
        else
            return 'Starting in ' + Math.abs(days);
    }

    return (
        <>
            <CustomNavbar currentPage={'Skips'} addNewClick={'/Skip'} />
            <div className='skips-container'>
                <RadioGroup sx={{ marginTop: '20px', display: filteredSkips.length > 0 ? '' : 'none' }} value={selectedValue} onChange={handleRadioChange} row>
                    <FormControlLabel value="All" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="All" sx={{ display: 'inline' }} />
                    <FormControlLabel value="Booked" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Booked" sx={{ display: getBookedSkips().length > 0 ? 'inline' : 'none' }} />
                    <FormControlLabel value="Available" control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />} label="Available" sx={{ display: getAvailableSkips().length > 0 ? 'inline' : 'none' }} />
                </RadioGroup>
                <div className="skips-section">
                    {Array.isArray(filteredSkips) && filteredSkips.length > 0 ? filteredSkips.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn)).map((skip) => (
                        <SkipCard
                            key={skip.id}
                            statusBorder={skip.rented ? "10px solid red" : "10px solid green"}
                            name={`Skip ${skip.name}`}
                            size={skip.size === 1 ? 'Small' : 'Large'}
                            onClickView={() => handleOpenViewSkip(skip)}
                            onClickEdit={() => handleEditClick(skip.id)}
                            onClickDelete={() => handleShowDeleteDialog(skip)}
                            disabledDeleteButton={skip.rented ? true : false}
                        />
                    )) : <h5 style={{ marginTop: '20px' }}>There are no skips. Click Add New to create one.</h5>}
                </div>
            </div>
            {!skip.rented ?
                <Dialog open={openViewSkip} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseViewSkip(event, reason) } }}>
                    <DialogTitle sx={{ width: '400px', borderBottom: '1px solid #006d77', marginBottom: '10px' }}>
                        Skip Details
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Name:</FormLabel> {`Skip ${skip.name}`}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Size:</FormLabel> {skip.size === 1 ? 'Small' : 'Large'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Notes:</FormLabel> {skip.notes ? skip.notes : 'N/A'}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseViewSkip} />
                    </DialogActions>
                </Dialog> :
                <Dialog open={openViewSkip} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseViewSkip(event, reason) } }}>
                    <DialogTitle sx={{ width: '400px', borderBottom: '1px solid #006d77', marginBottom: '10px' }}>
                        Skip Details
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="h6" sx={{ margin: '5px' }} >
                            Skip
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Name:</FormLabel> {`Skip ${skip.name}`}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Size:</FormLabel> {skip.size === 1 ? 'Small' : 'Large'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Notes:</FormLabel> {skip.notes ? skip.notes : 'N/A'}
                        </Typography>
                        <hr />
                        <Typography variant="h6" sx={{ margin: '5px' }} >
                            Booking
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Address:</FormLabel> {booking.address}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Hire Date:</FormLabel> {new Date(booking.hireDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Hired For:</FormLabel> {handleCalculateDays(booking.hireDate)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Notes:</FormLabel> {booking.notes ? booking.notes : 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Returned:</FormLabel> {booking.returned ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Paid:</FormLabel> {booking.paid ? 'Yes' : 'No'}
                        </Typography>
                        <hr />
                        <Typography variant="h6" sx={{ margin: '5px' }} >
                            Customer
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Last Name:</FormLabel> {customer.lastName}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>First Name:</FormLabel> {customer.firstName}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Phone:</FormLabel> {customer.phone}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Address:</FormLabel> {customer.address}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Email:</FormLabel> {customer.email ? customer.email : 'N/A'}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseViewSkip} />
                    </DialogActions>
                </Dialog>
            }
            <Dialog open={openDeleteDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseDeleteDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    Delete Skip?
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"No"} width={"100px"} height={"45px"} onClick={handleCloseDeleteDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Yes"} width={"100px"} height={"45px"} onClick={() => handleDeleteClick(skip.id)} />
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseDeleteSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    Skip Deleted.
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseDeleteSuccess} />
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Skips;