import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './custom.css';
import Home from './pages/Home/Home';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Reminders from './pages/Reminders/Reminders';
import Customers from './pages/Customers/Customers';

const App = () => {
  const hasToken = sessionStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={hasToken ? <Navigate to="/Reminders" /> : <Home />} />
      <Route element={<PrivateRoute />}>
        <Route path="/Reminders" element={<Reminders />} />
        <Route path="/Customers" element={<Customers />} />
      </Route>
    </Routes>
  );
};

export default App;