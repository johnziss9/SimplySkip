import React, { useState, useEffect, useCallback } from "react";
import './Bookings.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormLabel, Radio, RadioGroup, Typography, useMediaQuery, CircularProgress } from "@mui/material";
import BookingCard from "../../components/BookingCard/BookingCard";
import UpdatesButton from "../../components/UpdatesButton/UpdatesButton";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import handleHttpRequest from "../../api/api";

function Bookings() {

    const navigate = useNavigate();

    const [selectedValue, setSelectedValue] = useState('All'); // Handling the Radio Buttons
    const [bookings, setBookings] = useState([]);
    const [customerDetails, setCustomerDetails] = useState({});
    const [booking, setBooking] = useState({});
    const [customer, setCustomer] = useState({});
    const [openViewBooking, setOpenViewBooking] = useState(false);
    const [skip, setSkip] = useState({}); // Used for changing skip status
    const [openCancelSuccess, setOpenCancelSuccess] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const [totalBookings, setTotalBookings] = useState(0);
    const [filterCounts, setFilterCounts] = useState({
        All: 0,
        Active: 0,
        Unpaid: 0,
        Past: 0,
        Cancelled: 0
    });

    const radioButtonsWidth = useMediaQuery('(max-width: 550px)');

    useEffect(() => {
        // Initial load
        handleFetchBookings(1, filter);

        // Add scroll listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (page > 1) { // Only fetch if it's not the initial load
            handleFetchBookings(page, filter);
        }
        // eslint-disable-next-line
    }, [page]);

    // Content check effect
    useEffect(() => {
        if (bookings.length > 0) {
            checkContentAndLoadMore();
        }
        // eslint-disable-next-line
    }, [bookings]);

    const handleFetchBookings = async (currentPage = 1, filterValue = filter) => {
        try {
            setIsLoading(true);
            const url = `/booking/pagination?page=${currentPage}${filterValue ? `&filter=${filterValue}` : ''}`;
            const method = 'GET';

            const { success, data } = await handleHttpRequest(url, method);

            if (success) {
                if (data.items.length === 0) {
                    setHasMore(false);
                    return;
                }

                setBookings(prevBookings =>
                    currentPage === 1 ? data.items : [...prevBookings, ...data.items]
                );

                setFilterCounts(data.counts);
                setTotalBookings(data.totalCount);
                setHasMore(data.hasNext);
                handleGetCustomer(data.items);
            } else {
                setSnackbarMessage('Failed to load bookings.');
                setShowSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('An error occurred while loading bookings.');
            setShowSnackbar(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetCustomer = async (bookings) => {
        const promises = bookings.map(async (booking) => {
            const url = `/customer/${booking.customerId}`;
            const method = 'GET';

            const { success, data } = await handleHttpRequest(url, method);

            if (success) {
                return { [booking.customerId]: data };
            } else {
                setSnackbarMessage('Failed to load customer for current booking.');
                setShowSnackbar(true);
            }
        });

        try {
            const results = await Promise.all(promises);

            const details = {};
            results.forEach((result) => {
                if (result) {
                    const customerId = Object.keys(result)[0];
                    details[customerId] = result[customerId];
                }
            });

            setCustomerDetails(prevDetails => ({
                ...prevDetails,
                ...details
            }));
        } catch (error) {
            setSnackbarMessage('An error occurred. Please try again later.');
            setShowSnackbar(true);
        }
    };

    const handleFetchCustomer = async (id) => {
        const url = `/customer/${id}`;
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {
            setCustomer(data);
        } else {
            setSnackbarMessage('Failed to load customer.');
            setShowSnackbar(true);
        }
    };

    const handleFetchSkip = async (id) => {
        const url = `/skip/${id}`;
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {
            setSkip(data);
        } else {
            setSnackbarMessage('Failed to load skip.');
            setShowSnackbar(true);
        }
    };

    const handleOpenViewBooking = (booking) => {
        setBooking(booking);
        handleFetchCustomer(booking.customerId)
        handleFetchSkip(booking.skipId);
        setOpenViewBooking(true);
    }
    const handleCloseViewBooking = () => setOpenViewBooking(false);

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
        setFilter(event.target.value);
        setPage(1);  // Reset to first page
        setBookings([]); // Clear existing bookings
        handleFetchBookings(1, event.target.value);  // Fetch with new filter
    };

    const handleEditClick = (id) => {
        navigate(`/Booking/${id}/all-bookings`);
    }

    const handleCancelClick = async () => {
        const url = `/booking/${booking.id}`;
        const method = 'PUT';
        const body = {
            customerId: booking.customerId,
            skipId: booking.skipId,
            hireDate: booking.hireDate,
            returnDate: booking.returnDate,
            address: booking.address.replace(/\n/g, ', '),
            notes: booking.notes.replace(/\n/g, ', '),
            returned: booking.returned,
            paid: booking.paid,
            cancelled: true,
            createdOn: booking.createdOn,
            lastUpdated: new Date(new Date()),
            cancelledOn: new Date(new Date())
        };

        const { success } = await handleHttpRequest(url, method, body);

        if (success) {
            handleFetchCustomer().then((customerData) => {
                handleAddAuditLogEntry(`Ακὐρωση κρἀτησης για τον πελἀτη ${customerData.lastName}, ${customerData.firstName}.`);
            });

            const url = `/skip/${booking.skipId}`;
            const method = 'GET';

            const { success, data } = await handleHttpRequest(url, method);

            if (success) {
                setSkip(data)

                const url = `/skip/${data.id}`;
                const method = 'PUT';
                const body = {
                    name: data.name,
                    size: data.size,
                    notes: data.notes,
                    rented: false,
                    deleted: data.deleted,
                    createdOn: data.createdOn,
                    lastUpdated: new Date(new Date()),
                    deleteOn: data.deleteOn
                };

                const { success } = await handleHttpRequest(url, method, body);

                if (success) {
                    setSnackbarMessage(`Η κράτηση ακυρώθηκε. Το Skip ${data.name} είναι τώρα διαθέσιμο.`);
                    setSnackbarSuccess(true);
                    setShowSnackbar(true);
                } else {
                    setSnackbarMessage('Failed to update skip availability.');
                    setShowSnackbar(true);
                }
            } else {
                setSnackbarMessage('Failed to find skip associated to this booking.');
                setShowSnackbar(true);
            }

            handleShowCancelSuccess();
        } else {
            setSnackbarMessage('Failed to set booking to cancelled.');
            setShowSnackbar(true);
        }
    }

    const handleAddAuditLogEntry = async (action) => {
        const url = '/auditLog/';
        const method = 'POST';
        const body = {
            userId: sessionStorage.getItem('userId'),
            username: sessionStorage.getItem('username'),
            action: action
        };

        const { success } = await handleHttpRequest(url, method, body);

        if (!success) {
            setSnackbarMessage('Failed to add audit log.');
            setShowSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage('');
        setSnackbarSuccess(false);
    };

    const handleShowCancelDialog = (booking) => {
        setBooking(booking)
        setOpenCancelDialog(true);
    }
    const handleCloseCancelDialog = () => setOpenCancelDialog(false);

    const handleShowCancelSuccess = () => {
        handleCloseCancelDialog();
        setOpenCancelSuccess(true);
        handleFetchBookings();
    }
    const handleCloseCancelSuccess = () => setOpenCancelSuccess(false);

    function handleCalculateDays(hireDate) {
        const dateOfHire = new Date(hireDate);
        const today = new Date();
        const timeDifference = today - dateOfHire;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

        if (days > 0) {
            if (days === 1)
                return 'Εκτὀς για ' + Math.abs(days) + ' μέρα';
            else
                return 'Εκτὀς για ' + Math.abs(days) + ' μέρες';
        }
        else if (days === 0)
            return 'Εκτὀς Σἠμερα'
        else {
            if (days === -1)
                return 'Ξεκινά σε ' + Math.abs(days) + ' μέρα';
            else
                return 'Ξεκινά σε ' + Math.abs(days) + ' μέρες';
        }
    }

    const handleFilterClick = () => {
        setShowFilter(!showFilter);
    };

    const handleScroll = () => {
        if (
            !isLoading &&
            hasMore &&
            (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 200
        ) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const checkContentAndLoadMore = useCallback(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (
            !isLoading &&
            hasMore &&
            documentHeight <= windowHeight
        ) {
            setPage(prevPage => prevPage + 1);
        }
    }, [isLoading, hasMore]);

    return (
        <>
            <CustomNavbar currentPage={'Κρατἠσεις'} addNewClick={'/Booking'} addNewSource="all-bookings" />
            <div className='bookings-container'>
                {bookings.length > 0 && (
                    <CustomButton
                        backgroundColor="#006d77"
                        buttonName="ΦΙΛΤΡΟ"
                        width="100px"
                        height="45px"
                        margin="20px 0 0 0"
                        onClick={handleFilterClick}
                    />
                )}
                {showFilter && (
                    <div style={{ marginTop: '10px' }}>
                        <RadioGroup
                            sx={{ width: radioButtonsWidth ? '300px' : '455px', justifyContent: 'center' }}
                            value={selectedValue}
                            onChange={handleRadioChange}
                            row
                        >
                            <FormControlLabel
                                value="All"
                                control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />}
                                label={`Όλες (${filterCounts.all})`}
                            />
                            <FormControlLabel
                                value="Active"
                                control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />}
                                label={`Τρέχουσες (${filterCounts.active})`}
                            />
                            <FormControlLabel
                                value="Unpaid"
                                control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />}
                                label={`Ανεξόφλητες (${filterCounts.unpaid})`}
                            />
                            <FormControlLabel
                                value="Past"
                                control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />}
                                label={`Ολοκληρωμένες (${filterCounts.past})`}
                            />
                            <FormControlLabel
                                value="Cancelled"
                                control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />}
                                label={`Ακυρωμένες (${filterCounts.cancelled})`}
                            />
                        </RadioGroup>
                    </div>
                )}
                <div className="bookings-section">
                    {!showFilter && (
                        <Typography sx={{ marginTop: '20px', color: '#006d77', width: '100%', textAlign: 'center' }}>
                            {`Σύνολο Κρατήσεων: ${totalBookings}`}
                        </Typography>
                    )}
                    {Array.isArray(bookings) && bookings.length > 0 ? bookings.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn)).map((booking) => (
                        <BookingCard
                            key={booking.id}
                            statusBorder={booking.cancelled // cancelled
                                ? "10px solid black"
                                : !booking.cancelled && !booking.returned && !booking.paid // active
                                    ? "10px solid green"
                                    : !booking.cancelled && booking.returned && !booking.paid // retuend & unpaid
                                        ? "10px solid red"
                                        : !booking.cancelled && booking.returned && booking.paid // past
                                            ? "10px solid grey"
                                            : "10px solid white"}
                            customerDeleted={customerDetails[booking.customerId]?.deleted}
                            lastName={customerDetails[booking.customerId]?.lastName}
                            firstName={customerDetails[booking.customerId]?.firstName}
                            hireDate={new Date(booking.hireDate).toLocaleDateString()}
                            returnDateOrDays={booking.returned ? new Date(booking.returnDate).toLocaleDateString() : booking.cancelled ? 'Cancelled' : handleCalculateDays(booking.hireDate)}
                            address={booking.address}
                            onClickView={() => handleOpenViewBooking(booking)}
                            onClickEdit={() => handleEditClick(booking.id)}
                            onClickCancel={() => handleShowCancelDialog(booking)}
                            disabledEditButton={(booking.returned && booking.paid) || booking.cancelled}
                            disabledCancelButton={booking.returned || booking.paid || booking.cancelled || new Date(booking.hireDate) <= new Date()}
                        />
                    )) : <h5 style={{ marginTop: '20px', textAlign: 'center', padding: '0 10px' }}>Δεν υπάρχουν κρατήσεις. Κάντε κλικ στο Προσθήκη Νέου για να δημιουργήσετε μία.</h5>}
                    {isLoading && hasMore && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', width: '100%' }}>
                            <CircularProgress size={40} sx={{ color: '#006d77' }} />
                        </div>
                    )}
                </div>
            </div>
            <Dialog open={openViewBooking} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseViewBooking(event, reason) } }}>
                <DialogTitle sx={{ width: '100%', borderBottom: '1px solid #006d77', marginBottom: '10px' }}>
                    Πληροφορἰες Κρἀτησης
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h6" sx={{ margin: '5px' }} >
                        Πελἀτης
                        {customer.deleted && (
                            <span style={{ fontStyle: 'italic', fontSize: '17px' }}>
                                {' '} (Ἐχει Διαγραφεί)
                            </span>
                        )}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px', ...(customer.deleted ? { textDecoration: 'line-through' } : {}) }} >
                        <FormLabel>Επὠνυμο:</FormLabel> {customer.lastName}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px', ...(customer.deleted ? { textDecoration: 'line-through' } : {}) }} >
                        <FormLabel>Ὀνομα:</FormLabel> {customer.firstName}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Τηλἐφωνο:</FormLabel> {customer.phone}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Διεὐθυνση:</FormLabel> {customer.address}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Email:</FormLabel> {customer.email ? customer.email : 'Μ/Δ'}
                    </Typography>
                    <hr />
                    <Typography variant="h6" sx={{ margin: '5px' }} >
                        Κρἀτηση
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Skip:</FormLabel> {skip.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Διεὐθυνση:</FormLabel> {booking.address}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Ημερομηνία Κρἀτησης:</FormLabel> {new Date(booking.hireDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Επιστροφή:</FormLabel> {booking.cancelled ? 'Cancelled' : !booking.returned ? handleCalculateDays(booking.hireDate) : new Date(booking.returnDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Σημειώσεις:</FormLabel> {booking.notes ? booking.notes : 'Μ/Δ'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Επιστράφηκε:</FormLabel> {booking.returned ? 'Ναι' : 'Ὀχι'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Πληρώθηκε:</FormLabel> {booking.paid ? 'Ναι' : 'Ὀχι'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                        <FormLabel>Ακυρώθηκε:</FormLabel> {booking.cancelled ? 'Ναι' : 'Ὀχι'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseViewBooking} />
                </DialogActions>
            </Dialog>
            <Dialog open={openCancelDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseCancelDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    Ακὐρωση Κρἀτησης;
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ὀχι"} width={"100px"} height={"45px"} onClick={handleCloseCancelDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ναι"} width={"100px"} height={"45px"} onClick={handleCancelClick} />
                </DialogActions>
            </Dialog>
            <Dialog open={openCancelSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseCancelSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '300px' }}>
                    Κρἀτηση Ακυρώθηκε.
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseCancelSuccess} />
                </DialogActions>
            </Dialog>
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity={snackbarSuccess ? 'success' : 'error'} />
        </>
    );
}

export default Bookings;