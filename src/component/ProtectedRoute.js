import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext.js'; // Adjust the import based on your file structure

const ProtectedRoute = ({ element }) => {
    const { user } = useContext(UserContext);

    return user && user.isLoggedIn ? element : <Navigate to="/" />;
  };

export default ProtectedRoute;
