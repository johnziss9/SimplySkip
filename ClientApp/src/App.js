import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './custom.css';
import Home from './pages/Home/Home';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Reminders from './pages/Reminders/Reminders';
import Customers from './pages/Customers/Customers';
import CustomerAddEdit from './pages/Customers/CustomerAddEdit';
import CustomerBookings from './pages/Bookings/CustomerBookings';
import BookingAddEdit from './pages/Bookings/BookingAddEdit';
import Bookings from './pages/Bookings/Bookings';
import Skips from './pages/Skips/Skips';
import SkipAddEdit from './pages/Skips/SkipAddEdit';

const App = () => {
  const hasToken = sessionStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={hasToken ? <Navigate to="/Bookings" /> : <Home />} />
      <Route element={<PrivateRoute />}>
        <Route path="/Customers" element={<Customers />} />
        <Route path="/Customer/:id?" element={<CustomerAddEdit />} />
        <Route path="/Bookings" element={<Bookings />} />
        <Route path="/Customer/:id/Bookings" element={<CustomerBookings />} />
        <Route path="/Booking/:id?" element={<BookingAddEdit />} />
        <Route path="/Skips" element={<Skips />} />
        <Route path="/Skip/:id?" element={<SkipAddEdit />} />
      </Route>
    </Routes>
  );
};

export default App;