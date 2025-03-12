import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './custom.css';
import Home from './pages/Home/Home';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Customers from './pages/Customers/Customers';
import CustomerAddEdit from './pages/Customers/CustomerAddEdit';
import CustomerBookings from './pages/Bookings/CustomerBookings';
import BookingAddEdit from './pages/Bookings/BookingAddEdit';
import Bookings from './pages/Bookings/Bookings';
import Skips from './pages/Skips/Skips';
import SkipAddEdit from './pages/Skips/SkipAddEdit';
import LogoutTimerDialog from './components/LogoutTimerDialog/LogoutTimerDialog';
import { useNavigate } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound';
import History from './pages/History/History';
import Addresses from './pages/Addresses/Addresses';

const App = () => {
  const navigate = useNavigate();

  const hasToken = sessionStorage.getItem('token');

  const [openDialog, setOpenDialog] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleYesClick = () => {
    setTimer(0);
    setOpenDialog(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      const interval = setInterval(() => {
        if (timer === 7140) {
          setOpenDialog(true);
        }
        if (timer === 7200) {
          clearInterval(interval);
          sessionStorage.clear();
          navigate('/');
          setOpenDialog(false);
        }
        setTimer(timer + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer, navigate]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={hasToken ? <Navigate to="/Bookings" /> : <Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/Customers" element={<Customers />} />
          <Route path="/Customer/:id?" element={<CustomerAddEdit />} />
          <Route path="/Addresses/:id?" element={<Addresses />} />
          <Route path="/Bookings" element={<Bookings />} />
          <Route path="/Customer/:id/Bookings" element={<CustomerBookings />} />
          <Route path="/Booking/:id?/:source?" element={<BookingAddEdit />} />
          <Route path="/Skips" element={<Skips />} />
          <Route path="/Skip/:id?" element={<SkipAddEdit />} />
          <Route path="/History" element={<History />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <LogoutTimerDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onYesClick={handleYesClick}
      />
    </>

  );
};

export default App;