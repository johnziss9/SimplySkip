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
import CustomAutocomplete from './components/CustomAutocomplete/CustomAutocomplete';

const App = () => {
  const hasToken = sessionStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={hasToken ? <Navigate to="/Reminders" /> : <Home />} />
      <Route element={<PrivateRoute />}>
        <Route path="/Reminders" element={<Reminders />} />
        <Route path="/Customers" element={<Customers />} />
        <Route path="/Customer/:id?" element={<CustomerAddEdit />} />
        <Route path="/Customer/:id/Bookings" element={<CustomerBookings />} />
        <Route path="/Booking/:id?" element={<BookingAddEdit />} />
      </Route>
    </Routes>
  );
};

export default App;