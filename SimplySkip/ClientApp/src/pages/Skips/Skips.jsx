import { useState, useEffect } from "react";
import './Skips.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import SkipCard from "../../components/SkipCard/SkipCard";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormLabel, Radio, RadioGroup, Typography, CircularProgress } from "@mui/material";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import handleHttpRequest from "../../api/api";

function Skips() {

    const navigate = useNavigate();

    const [skips, setSkips] = useState([]);
    const [skip, setSkip] = useState({});
    const [booking, setBooking] = useState({});
    const [bookings, setBookings] = useState({}); // Store bookings by skipId
    const [customer, setCustomer] = useState({});
    const [selectedValue, setSelectedValue] = useState('All'); // Handling the Radio Buttons
    const [sortBy, setSortBy] = useState('name');
    const [openViewSkip, setOpenViewSkip] = useState(false); // Handling the View Skip Dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const [totalSkips, setTotalSkips] = useState(0);
    const [filterCounts, setFilterCounts] = useState({
            All: 0,
            Rented: 0,
            Available: 0
        });

    // Initial load and scroll setup effect (no dependencies)
    useEffect(() => {
        // Initial load
        handleFetchSkips(1, filter);
        // eslint-disable-next-line
    }, []);

    const handleFetchSkips = async (currentPage = 1, filterValue = filter) => {
        try {
            setIsLoading(true);
            const url = `/skip/pagination?page=${currentPage}${filterValue ? `&filter=${filterValue}` : ''}`;
            const method = 'GET';

            const { success, data } = await handleHttpRequest(url, method);

            if (success) {
                setSkips(prevSkips =>
                    currentPage === 1 ? data.items : [...prevSkips, ...data.items]
                );

                // This function fetches booking details for a given skip Id in order to display booking information on the skip card.
                const rentedSkips = data.items.filter(skip => skip.rented);
                for (const skip of rentedSkips) {
                    await fetchBookingForSkip(skip.id);
                }

                setFilterCounts(data.counts);
                setTotalSkips(data.totalCount);
            } else {
                setSnackbarMessage('Failed to load skips.');
                setShowSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('An error occurred while loading skips.');
            setShowSnackbar(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFetchBookingDetails = async (skipId) => {
        try {
            const url = `/booking/skip/${skipId}`;
            const method = 'GET';

            const { success, data } = await handleHttpRequest(url, method);
            const booking = data;

            if (success) {
                setBooking(booking);

                const customerId = booking.customerId;

                const url = `/customer/${customerId}`;
                const method = 'GET';

                const { success, data } = await handleHttpRequest(url, method);

                if (success) {
                    setCustomer(data);
                } else {
                    setSnackbarMessage('Failed to load customer.');
                    setShowSnackbar(true);
                }
            } else {
                setSnackbarMessage('Failed to load booking.');
                setShowSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage(error || 'Something went wrong. Failed to load booking details.');
            setShowSnackbar(true);
        }
    }

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
        setFilter(event.target.value === 'All' ? '' : event.target.value);
        setSkips([]); // Clear existing skips
        handleFetchSkips(1, event.target.value === 'All' ? '' : event.target.value);
    };

    const fetchBookingForSkip = async (skipId) => {
        try {
            const url = `/booking/skip/${skipId}`;
            const method = 'GET';

            const { success, data } = await handleHttpRequest(url, method);
            
            if (success) {
                setBookings(prev => ({
                    ...prev,
                    [skipId]: data
                }));
            }
        } catch (error) {
            // Silent fail - card will just not show booking data
            console.error(`Failed to fetch booking for skip ${skipId}`);
        }
    };

    const handleEditClick = (id) => {
        navigate(`/Skip/${id}`);
    }

    const handleDeleteClick = async (id) => {
        const url = `/skip/${id}`;
        const method = 'PUT';
        const body = {
            name: skip.name,
            size: skip.size,
            notes: skip.notes.replace(/\n/g, ', '),
            rented: skip.rented,
            deleted: true,
            createdOn: skip.createdOn,
            lastUpdated: new Date(new Date()),
            deletedOn: new Date(new Date())
        };

        const { success } = await handleHttpRequest(url, method, body);

        if (success) {
            handleAddAuditLogEntry(`Διαγραφἠ του skip ${skip.name}.`);
            handleCloseDeleteDialog();
            handleShowDeleteSuccess();
        } else {
            setSnackbarMessage('Failed to delete skip.');
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
    };

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

    return (
        <>
            <CustomNavbar currentPage={'Skips'} addNewClick={'/Skip'} />
            <div className='skips-container'>
                {skips.length > 0 && (
                <CustomButton
                    backgroundColor="#006d77"
                    buttonName="ΦΙΛΤΡΟ & ΤΑΞΙΝΟΜΗΣΗ"
                    width="205px"
                    height="45px"
                    margin="20px 0 0 0"
                    onClick={handleFilterClick}
                />
            )}
            {showFilter && (
                <div style={{ marginTop: '10px' }}>
                    <FormLabel sx={{ color: '#006d77', fontWeight: 'bold' }}>Φίλτρο:</FormLabel>
                    <RadioGroup
                        value={selectedValue}
                        onChange={handleRadioChange}
                        row
                    >
                        <FormControlLabel
                            value="All"
                            control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />}
                            label={`Ὀλα (${filterCounts.all})`}
                            sx={{ display: 'inline' }}
                        />
                        <FormControlLabel
                            value="Booked"
                            control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />}
                            label={`Κρατημἐνα (${filterCounts.rented})`}
                            sx={{ display: 'inline' }}
                        />
                        <FormControlLabel
                            value="Available"
                            control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />}
                            label={`Διαθέσιμα (${filterCounts.available})`}
                            sx={{ display: 'inline' }}
                        />
                    </RadioGroup>
                    
                    <FormLabel sx={{ color: '#006d77', fontWeight: 'bold', marginTop: '10px', display: 'block' }}>Ταξινόμηση:</FormLabel>
                    <RadioGroup
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        row
                    >
                        <FormControlLabel
                            value="name"
                            control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />}
                            label="Αριθμός Skip"
                            sx={{ display: 'inline' }}
                        />
                        <FormControlLabel
                            value="daysOut"
                            control={<Radio sx={{ color: '#006d77', '&.Mui-checked': { color: '#006d77' } }} />}
                            label="Ημέρες Εκτός"
                            sx={{ display: 'inline' }}
                        />
                    </RadioGroup>
                </div>
            )}
                <div className="skips-section">
                    {!showFilter && (
                        <Typography sx={{ marginTop: '20px', color: '#006d77', width: '100%', textAlign: 'center' }}>
                            {`Σύνολο Skip: ${totalSkips}`}
                        </Typography>
                    )}
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', width: '100%'}}>
                            <CircularProgress size={40} sx={{ color: '#006d77' }} />
                        </div>
                    ) : Array.isArray(skips) && skips.length > 0 ? skips.sort((a, b) => {
                        if (sortBy === 'daysOut') {
                            if (a.rented && !b.rented) return -1;
                            if (!a.rented && b.rented) return 1;
                            if (a.rented && b.rented) {
                                const bookingA = bookings[a.id];
                                const bookingB = bookings[b.id];
                                if (bookingA && bookingB) {
                                    return new Date(bookingA.hireDate) - new Date(bookingB.hireDate); // Oldest hire date first (most days out)
                                }
                            }
                            return 0;
                        } else {
                            // Default to sort by skip name
                            return a.name.localeCompare(b.name);
                        }
                    }).map((skip) => {
                        const skipBooking = bookings[skip.id];
                        return (
                            <SkipCard
                                key={skip.id}
                                statusBorder={skip.rented ? "10px solid red" : "10px solid green"}
                                name={`Skip ${skip.name}`}
                                size={skip.size === 1 ? 'Small' : 'Large'}
                                rented={skip.rented}
                                hireDate={skip.rented && skipBooking ? `${new Date(skipBooking.hireDate).toLocaleDateString()}` : null}
                                returnDateOrDays={skip.rented && skipBooking ? `${handleCalculateDays(skipBooking.hireDate)}` : null}
                                onClick={() => handleOpenViewSkip(skip)}
                                onClickEdit={() => handleEditClick(skip.id)}
                                onClickDelete={() => handleShowDeleteDialog(skip)}
                                disabledDeleteButton={skip.rented ? true : false}
                            />
                        );
                    }) : <h5 style={{ marginTop: '20px', textAlign: 'center', padding: '0 10px' }}>Δεν υπάρχουν skips. Κάντε κλικ στο Προσθήκη Νέου για να δημιουργήσετε ένα.</h5>}
                </div>
            </div>
            {!skip.rented ?
                <Dialog open={openViewSkip} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseViewSkip(event, reason) } }}>
                    <DialogTitle sx={{ width: '100%', borderBottom: '1px solid #006d77', marginBottom: '10px' }}>
                        Πληροφορίες του Skip
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Αριθμὀς:</FormLabel> {`Skip ${skip.name}`}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Μἐγεθος:</FormLabel> {skip.size === 1 ? 'Small' : 'Large'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Σημειώσεις:</FormLabel> {skip.notes ? skip.notes : 'Μ/Δ'}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseViewSkip} />
                    </DialogActions>
                </Dialog> :
                <Dialog open={openViewSkip} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseViewSkip(event, reason) } }}>
                    <DialogTitle sx={{ width: '100%', borderBottom: '1px solid #006d77', marginBottom: '10px' }}>
                        Πληροφορίες του Skip
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="h6" sx={{ margin: '5px' }} >
                            Skip
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Αριθμὀς:</FormLabel> {`Skip ${skip.name}`}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Μἐγεθος:</FormLabel> {skip.size === 1 ? 'Small' : 'Large'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Σημειώσεις:</FormLabel> {skip.notes ? skip.notes : 'Μ/Δ'}
                        </Typography>
                        <hr />
                        <Typography variant="h6" sx={{ margin: '5px' }} >
                            Κρἀτηση
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Διεὐθυνση:</FormLabel> {booking.address}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Ημερομηνία Κρἀτησης:</FormLabel> {new Date(booking.hireDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Επιστροφή:</FormLabel> {!booking.returned ? handleCalculateDays(booking.hireDate) : new Date(booking.returnDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Σημειώσεις:</FormLabel> {booking.notes ? booking.notes : 'Μ/Δ'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Επιστράφηκε:</FormLabel> {booking.returned ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Πληρώθηκε:</FormLabel> {booking.paid ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Ακυρώθηκε:</FormLabel> {booking.cancelled ? 'Ναι' : 'Ὀχι'}
                        </Typography>
                        <hr />
                        <Typography variant="h6" sx={{ margin: '5px' }} >
                            Πελἀτης
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Επὠνυμο:</FormLabel> {customer.lastName}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Ὀνομα:</FormLabel> {customer.firstName}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Τηλἐφωνο:</FormLabel> {customer.phone}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '20px', margin: '5px' }} >
                            <FormLabel>Email:</FormLabel> {customer.email ? customer.email : 'Μ/Δ'}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseViewSkip} />
                    </DialogActions>
                </Dialog>
            }
            <Dialog open={openDeleteDialog} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseDeleteDialog(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    Διαγραφή του Skip;
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"ΟΧΙ"} width={"100px"} height={"45px"} onClick={handleCloseDeleteDialog} />
                    <CustomButton backgroundColor={"#006d77"} buttonName={"ΝΑΙ"} width={"100px"} height={"45px"} onClick={() => handleDeleteClick(skip.id)} />
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteSuccess} onClose={(event, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') { handleCloseDeleteSuccess(event, reason) } }}>
                <DialogTitle sx={{ width: '400px' }}>
                    Το Skip Ἐχει Διαγραφεί.
                </DialogTitle>
                <DialogActions>
                    <CustomButton backgroundColor={"#006d77"} buttonName={"Ok"} width={"100px"} height={"45px"} onClick={handleCloseDeleteSuccess} />
                </DialogActions>
            </Dialog>
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity="error" />
        </>
    );
}

export default Skips;