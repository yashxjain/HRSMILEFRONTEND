import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // Optionally return a loading spinner or null while checking auth state
        return <div>Loading...</div>;
    }

    return user ? <Component {...rest} /> : <Navigate to="/" />;
};


export default PrivateRoute;
