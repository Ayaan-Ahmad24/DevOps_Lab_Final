// src/Components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Component that handles admin authentication
const PrivateRoute = ({ element }) => {
    const isAdminLoggedIn = !!localStorage.getItem('adminToken');

    // Render the component if the admin is logged in, otherwise redirect to login
    return isAdminLoggedIn ? element : <Navigate to="/admin/login" />;
};

PrivateRoute.propTypes = {
    element: PropTypes.node.isRequired,
};

export default PrivateRoute;
