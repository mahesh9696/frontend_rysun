import React from 'react';
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from 'jwt-decode';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let decodedToken = null;

    if (token) {
        decodedToken = jwtDecode(token);
    }

    const Logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div className="container">
            {token && (
                <div>
                    <nav>
                        <ul>
                            {decodedToken?.role == 'admin' && <li><Link to="/user">Users</Link></li>}
                            <li><Link to="/dashboard">Products</Link></li>
                            <button onClick={() => Logout()} className="btn btn-outline-danger float-end"> Logout </button>
                        </ul>
                    </nav>
                    <div>
                        <p>Welcome, {decodedToken?.fullName} ({decodedToken?.role})</p>
                        {/* Display other information from the token as needed */}
                    </div>
                </div>
            )}
            {children}
        </div>
    );
};

export default Layout;
