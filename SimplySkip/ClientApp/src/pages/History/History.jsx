import React, { useState, useEffect } from "react";
import './History.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, useMediaQuery } from '@mui/material';
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import handleHttpRequest from "../../api/api";

function History() {
    const [auditLogs, setAuditLogs] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [sortDirection, setSortDirection] = React.useState('asc');
    const [sortBy, setSortBy] = React.useState('timestamp');
    const [searchQuery, setSearchQuery] = useState('');

    const searchbarWidth = useMediaQuery('(max-width: 550px)');

    useEffect(() => {
        handleFetchAuditLogs();
        // eslint-disable-next-line
    }, []);

    const handleFetchAuditLogs = async () => {
        const url = '/auditLog/';
        const method = 'GET';

        const { success, data } = await handleHttpRequest(url, method);

        if (success) {
            setAuditLogs(data.reverse());
        } else {
            setSnackbarMessage('Failed to load audit logs.');
            setShowSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage('');
    };

    const handleSort = (property) => {
        const isAsc = sortBy === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortBy(property);
        const sortedLogs = auditLogs.sort((a, b) => {
            if (isAsc) {
                return a[property] > b[property] ? 1 : -1;
            } else {
                return a[property] < b[property] ? 1 : -1;
            }
        });
        setAuditLogs(sortedLogs);
    };

    const filteredAuditLogs = auditLogs.filter((auditLog) =>
        auditLog.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auditLog.action.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <CustomNavbar currentPage={'Ιστορικό'} />
            <div className='history-container'>
                <CustomTextField
                    label={'Αναζήτηση...'}
                    variant={'standard'}
                    type={'search'}
                    width={searchbarWidth ? '300px' : '500px'}
                    margin={'normal'}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    display={auditLogs.length > 0 ? '' : 'none'}
                />
                <TableContainer component={Paper} className="history-table-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === 'username'}
                                        direction={sortDirection}
                                        onClick={() => handleSort('username')}
                                    >
                                        Χρήστης
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Δράση</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === 'timestamp'}
                                        direction={sortDirection}
                                        onClick={() => handleSort('timestamp')}
                                    >
                                        Ημέρα/Ώρα
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAuditLogs.map((al) => (
                                <TableRow key={al.id}>
                                    <TableCell>{al.username}</TableCell>
                                    <TableCell>{al.action}</TableCell>
                                    <TableCell>{new Date(al.timestamp).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <CustomSnackbar open={showSnackbar} onClose={handleCloseSnackbar} onClickIcon={handleCloseSnackbar} content={snackbarMessage} severity="error" />
        </>
    );
}

export default History;