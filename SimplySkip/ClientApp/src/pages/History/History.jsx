import React, { useState, useEffect } from "react";
import './History.css';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import handleHttpRequest from "../../api/api";

function History() {
    const [auditLogs, setAuditLogs] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

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

    return (
        <>
            <CustomNavbar currentPage={'Ιστορικό'} />
            <div className='history-container'>
                <TableContainer component={Paper} className="history-table-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Χρήστης</TableCell>
                                <TableCell>Δράση</TableCell>
                                <TableCell>Ημέρα/Ώρα</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {auditLogs.map((al) => (
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